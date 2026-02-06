import FormData from 'form-data';
import { AuthensureConfig, RequestOptions } from './types';
import {
  AuthensureError,
  AuthenticationError,
  RateLimitError,
  NetworkError,
  TimeoutError,
  NotFoundError,
} from './errors';

const DEFAULT_BASE_URL = 'https://api.authensure.app/api';
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY = 1000;

export class HttpClient {
  private baseUrl: string;
  private apiKey?: string;
  private accessToken?: string;
  private timeout: number;
  private retryAttempts: number;
  private retryDelay: number;
  private debug: boolean;

  constructor(config: AuthensureConfig) {
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.apiKey = config.apiKey;
    this.accessToken = config.accessToken;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.retryAttempts = config.retryAttempts ?? DEFAULT_RETRY_ATTEMPTS;
    this.retryDelay = config.retryDelay ?? DEFAULT_RETRY_DELAY;
    this.debug = config.debug || false;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  clearAccessToken(): void {
    this.accessToken = undefined;
  }

  private getAuthHeader(): string | undefined {
    if (this.accessToken) {
      return `Bearer ${this.accessToken}`;
    }
    if (this.apiKey) {
      return `Bearer ${this.apiKey}`;
    }
    return undefined;
  }

  private log(message: string, data?: unknown): void {
    if (this.debug) {
      console.log(`[Authensure SDK] ${message}`, data ?? '');
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private shouldRetry(status: number, attempt: number): boolean {
    if (attempt >= this.retryAttempts) return false;
    return status === 429 || status >= 500;
  }

  private getRetryDelay(attempt: number, retryAfter?: number): number {
    if (retryAfter) return retryAfter * 1000;
    return this.retryDelay * Math.pow(2, attempt);
  }

  async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    let attempt = 0;

    while (true) {
      try {
        const headers: Record<string, string> = {
          'Accept': 'application/json',
          ...options?.headers,
        };

        const authHeader = this.getAuthHeader();
        if (authHeader) {
          headers['Authorization'] = authHeader;
        }

        if (body && !(body instanceof FormData)) {
          headers['Content-Type'] = 'application/json';
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          options?.timeout || this.timeout
        );

        const fetchOptions: RequestInit = {
          method,
          headers,
          signal: options?.signal || controller.signal,
        };

        if (body) {
          if (body instanceof FormData) {
            fetchOptions.body = body.getBuffer();
            const formHeaders = body.getHeaders();
            Object.assign(headers, formHeaders);
          } else {
            fetchOptions.body = JSON.stringify(body);
          }
        }

        this.log(`${method} ${path}`, { body: body instanceof FormData ? '[FormData]' : body });

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type');
        let data: unknown;

        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else if (contentType?.includes('application/pdf') || contentType?.includes('application/octet-stream')) {
          data = await response.arrayBuffer();
        } else {
          data = await response.text();
        }

        this.log(`Response ${response.status}`, data);

        if (!response.ok) {
          const error = this.createError(response.status, data);
          
          if (this.shouldRetry(response.status, attempt)) {
            const retryAfter = response.headers.get('Retry-After');
            const delay = this.getRetryDelay(attempt, retryAfter ? parseInt(retryAfter, 10) : undefined);
            this.log(`Retrying in ${delay}ms (attempt ${attempt + 1}/${this.retryAttempts})`);
            await this.sleep(delay);
            attempt++;
            continue;
          }

          throw error;
        }

        return data as T;
      } catch (error) {
        if (error instanceof AuthensureError) {
          throw error;
        }

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw new TimeoutError();
          }
          if (error.message.includes('fetch')) {
            throw new NetworkError(error.message);
          }
        }

        throw new NetworkError('An unexpected error occurred');
      }
    }
  }

  private createError(status: number, data: unknown): AuthensureError {
    const errorData = data as { message?: string; error?: string; retryAfter?: number; errors?: Record<string, string[]> };
    const message = errorData?.message || errorData?.error || 'Request failed';

    switch (status) {
      case 401:
        return new AuthenticationError(message);
      case 404:
        return new NotFoundError();
      case 429:
        return new RateLimitError(message, errorData?.retryAfter);
      default:
        return AuthensureError.fromResponse(errorData || {}, status);
    }
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  async uploadFile<T>(
    path: string,
    file: Buffer | Uint8Array,
    filename: string,
    mimeType: string,
    additionalFields?: Record<string, string>,
    options?: RequestOptions
  ): Promise<T> {
    const form = new FormData();
    form.append('file', file, { filename, contentType: mimeType });
    
    if (additionalFields) {
      for (const [key, value] of Object.entries(additionalFields)) {
        form.append(key, value);
      }
    }

    return this.request<T>('POST', path, form, options);
  }
}
