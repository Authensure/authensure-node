import { HttpClient } from '../http-client';
import type { User, UserProfile, UpdateProfileParams, PresenceStatus } from '../types';

export class UsersResource {
  constructor(private http: HttpClient) {}

  async list(organizationId?: string): Promise<User[]> {
    const query = organizationId ? `?organizationId=${organizationId}` : '';
    return this.http.get<User[]>(`/users${query}`);
  }

  async get(id: string): Promise<User> {
    return this.http.get<User>(`/users/${id}`);
  }

  async getMe(): Promise<UserProfile> {
    return this.http.get<UserProfile>('/users/profile/me');
  }

  async updateMe(data: UpdateProfileParams): Promise<User> {
    return this.http.patch<User>('/users/profile/me', data);
  }

  async getSettings(): Promise<Record<string, unknown>> {
    return this.http.get('/users/settings');
  }

  async updateSettings(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.http.put('/users/settings', settings);
  }

  async requestEmailChange(newEmail: string): Promise<{ message: string }> {
    return this.http.post('/users/profile/me/email', { email: newEmail });
  }

  async cancelEmailChange(): Promise<{ message: string }> {
    return this.http.delete('/users/profile/me/email');
  }

  async uploadAvatar(file: Buffer | Uint8Array, filename: string, mimeType: string): Promise<User> {
    return this.http.uploadFile<User>('/users/profile/me/avatar', file, filename, mimeType);
  }

  async deleteAvatar(): Promise<{ message: string }> {
    return this.http.delete('/users/profile/me/avatar');
  }

  async updatePresence(status: PresenceStatus): Promise<{ message: string }> {
    return this.http.patch('/users/profile/me/presence', { status });
  }

  async heartbeat(): Promise<{ message: string }> {
    return this.http.post('/users/profile/me/heartbeat');
  }

  async sendPhoneVerification(phone: string): Promise<{ message: string }> {
    return this.http.post('/users/profile/me/phone/send-verification', { phone });
  }

  async verifyPhone(code: string): Promise<{ message: string }> {
    return this.http.post('/users/profile/me/phone/verify', { code });
  }
}
