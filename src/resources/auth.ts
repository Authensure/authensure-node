import { HttpClient } from '../http-client';
import type {
  User,
  LoginResponse,
  Session,
  ChangePasswordParams,
} from '../types';

export class AuthResource {
  constructor(private http: HttpClient) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.http.post<LoginResponse>('/auth/login', { email, password });
    if (response.accessToken) {
      this.http.setAccessToken(response.accessToken);
    }
    return response;
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    referralCode?: string;
  }): Promise<{ message: string; userId: string }> {
    return this.http.post('/auth/register', data);
  }

  async getProfile(): Promise<User> {
    return this.http.get<User>('/auth/profile');
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return this.http.get(`/auth/verify-email/${token}`);
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    return this.http.post('/auth/resend-verification', { email });
  }

  async changePassword(params: ChangePasswordParams): Promise<{ message: string }> {
    return this.http.post('/auth/change-password', params);
  }

  async verifyMfa(mfaToken: string, code: string, method?: string): Promise<LoginResponse> {
    const response = await this.http.post<LoginResponse>('/auth/mfa/verify', {
      mfaToken,
      code,
      method,
    });
    if (response.accessToken) {
      this.http.setAccessToken(response.accessToken);
    }
    return response;
  }

  async sendMfaCode(mfaToken: string, method: 'EMAIL' | 'SMS' | 'AUTHENTICATOR'): Promise<{ message: string }> {
    return this.http.post('/auth/mfa/send-code', { mfaToken, method });
  }

  async getSessions(): Promise<Session[]> {
    return this.http.get<Session[]>('/auth/sessions');
  }

  async terminateSession(sessionId: string): Promise<{ message: string }> {
    return this.http.delete(`/auth/sessions/${sessionId}`);
  }

  async terminateAllSessions(): Promise<{ message: string }> {
    return this.http.delete('/auth/sessions');
  }

  logout(): void {
    this.http.clearAccessToken();
  }
}
