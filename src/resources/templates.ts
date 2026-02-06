import { HttpClient } from '../http-client';
import type {
  Template,
  TemplateDocument,
  TemplateField,
  TemplateRole,
  CreateTemplateParams,
  UseTemplateParams,
  Envelope,
} from '../types';

export class TemplatesResource {
  constructor(private http: HttpClient) {}

  async list(): Promise<Template[]> {
    return this.http.get<Template[]>('/templates');
  }

  async get(id: string): Promise<Template> {
    return this.http.get<Template>(`/templates/${id}`);
  }

  async create(params: CreateTemplateParams): Promise<Template> {
    return this.http.post<Template>('/templates', params);
  }

  async update(id: string, data: Partial<CreateTemplateParams>): Promise<Template> {
    return this.http.patch<Template>(`/templates/${id}`, data);
  }

  async delete(id: string): Promise<{ message: string }> {
    return this.http.delete(`/templates/${id}`);
  }

  async getUsage(): Promise<{ used: number; limit: number; remaining: number }> {
    return this.http.get('/templates/usage');
  }

  async getMarketplace(category?: string): Promise<Template[]> {
    const query = category ? `?category=${category}` : '';
    return this.http.get<Template[]>(`/templates/marketplace${query}`);
  }

  async addMarketplaceTemplate(id: string): Promise<Template> {
    return this.http.post<Template>(`/templates/marketplace/${id}/add`);
  }

  async addRole(templateId: string, name: string, orderIndex?: number): Promise<TemplateRole> {
    return this.http.post<TemplateRole>(`/templates/${templateId}/roles`, { name, orderIndex });
  }

  async updateRole(
    templateId: string,
    roleId: string,
    data: { name?: string; orderIndex?: number }
  ): Promise<TemplateRole> {
    return this.http.patch<TemplateRole>(`/templates/${templateId}/roles/${roleId}`, data);
  }

  async deleteRole(templateId: string, roleId: string): Promise<{ message: string }> {
    return this.http.delete(`/templates/${templateId}/roles/${roleId}`);
  }

  async uploadDocument(
    templateId: string,
    file: Buffer | Uint8Array,
    filename: string,
    mimeType = 'application/pdf'
  ): Promise<TemplateDocument> {
    return this.http.uploadFile<TemplateDocument>(
      `/templates/${templateId}/documents`,
      file,
      filename,
      mimeType
    );
  }

  async addField(
    templateId: string,
    documentId: string,
    field: Omit<TemplateField, 'id'>
  ): Promise<TemplateField> {
    return this.http.post<TemplateField>(
      `/templates/${templateId}/documents/${documentId}/fields`,
      field
    );
  }

  async updateField(
    templateId: string,
    documentId: string,
    fieldId: string,
    data: Partial<TemplateField>
  ): Promise<TemplateField> {
    return this.http.patch<TemplateField>(
      `/templates/${templateId}/documents/${documentId}/fields/${fieldId}`,
      data
    );
  }

  async deleteField(
    templateId: string,
    documentId: string,
    fieldId: string
  ): Promise<{ message: string }> {
    return this.http.delete(
      `/templates/${templateId}/documents/${documentId}/fields/${fieldId}`
    );
  }

  async use(templateId: string, params: UseTemplateParams): Promise<Envelope> {
    return this.http.post<Envelope>(`/templates/${templateId}/use`, params);
  }

  async getSubmissions(templateId: string): Promise<unknown[]> {
    return this.http.get(`/templates/${templateId}/submissions`);
  }

  async reviewSubmission(
    templateId: string,
    submissionId: string,
    action: 'approve' | 'reject',
    notes?: string
  ): Promise<{ message: string }> {
    return this.http.post(`/templates/${templateId}/submissions/${submissionId}/review`, {
      action,
      notes,
    });
  }
}
