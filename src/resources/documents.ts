import { HttpClient } from '../http-client';
import type { Document, DocumentField } from '../types';

export class DocumentsResource {
  constructor(private http: HttpClient) {}

  async list(): Promise<Document[]> {
    return this.http.get<Document[]>('/documents');
  }

  async get(id: string): Promise<Document> {
    return this.http.get<Document>(`/documents/${id}`);
  }

  async upload(
    envelopeId: string,
    file: Buffer | Uint8Array,
    filename: string,
    mimeType = 'application/pdf'
  ): Promise<Document> {
    return this.http.uploadFile<Document>(
      `/documents/upload/${envelopeId}`,
      file,
      filename,
      mimeType
    );
  }

  async getSignedUrl(id: string): Promise<{ url: string }> {
    return this.http.get<{ url: string }>(`/documents/${id}/signed-url`);
  }

  async updateFields(id: string, fields: DocumentField[]): Promise<Document> {
    return this.http.post<Document>(`/documents/${id}/fields`, { fields });
  }

  async delete(id: string): Promise<{ message: string }> {
    return this.http.delete(`/documents/${id}`);
  }

  async getRenderUrl(id: string): Promise<{ documentId: string; envelopeId: string; name: string }> {
    return this.http.get(`/documents/${id}/render-url`);
  }
}
