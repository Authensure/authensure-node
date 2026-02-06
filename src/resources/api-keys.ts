import { HttpClient } from '../http-client';
import type { ApiKey, ApiKeyWithSecret, ApiKeyStats, CreateApiKeyParams } from '../types';

export class ApiKeysResource {
  constructor(private http: HttpClient) {}

  async list(): Promise<ApiKey[]> {
    return this.http.get<ApiKey[]>('/api-keys');
  }

  async create(params: CreateApiKeyParams): Promise<ApiKeyWithSecret> {
    return this.http.post<ApiKeyWithSecret>('/api-keys', params);
  }

  async regenerate(id: string): Promise<ApiKeyWithSecret> {
    return this.http.post<ApiKeyWithSecret>(`/api-keys/${id}/regenerate`);
  }

  async delete(id: string): Promise<{ message: string }> {
    return this.http.delete(`/api-keys/${id}`);
  }

  async getStats(): Promise<ApiKeyStats> {
    return this.http.get<ApiKeyStats>('/api-keys/stats');
  }
}
