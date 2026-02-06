import { HttpClient } from '../http-client';
import type {
  Organization,
  OrganizationSettings,
  UpdateOrganizationParams,
  StoragePreference,
} from '../types';

export class OrganizationsResource {
  constructor(private http: HttpClient) {}

  async getCurrent(): Promise<Organization> {
    return this.http.get<Organization>('/organizations/current');
  }

  async updateCurrent(data: UpdateOrganizationParams): Promise<Organization> {
    return this.http.patch<Organization>('/organizations/current', data);
  }

  async updateSettings(settings: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
    return this.http.patch<OrganizationSettings>('/organizations/current/settings', settings);
  }

  async getTeams(): Promise<unknown[]> {
    return this.http.get('/organizations/current/teams');
  }

  async createTeam(name: string): Promise<unknown> {
    return this.http.post('/organizations/current/teams', { name });
  }

  async getStoragePreference(): Promise<{ preference: StoragePreference }> {
    return this.http.get('/organizations/storage-preference');
  }

  async updateStoragePreference(preference: StoragePreference): Promise<{ preference: StoragePreference }> {
    return this.http.patch('/organizations/storage-preference', { preference });
  }

  async getStorageFolder(): Promise<{
    folderId: string | null;
    folderName: string | null;
    folderPath: string | null;
  }> {
    return this.http.get('/organizations/storage-folder');
  }

  async updateStorageFolder(
    folderId: string | null,
    folderName: string | null,
    folderPath: string | null
  ): Promise<{ message: string }> {
    return this.http.patch('/organizations/storage-folder', {
      folderId,
      folderName,
      folderPath,
    });
  }
}
