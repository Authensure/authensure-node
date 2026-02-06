import { HttpClient } from '../http-client';
import type { SavedSignature } from '../types';

export class SignaturesResource {
  constructor(private http: HttpClient) {}

  async getSaved(): Promise<SavedSignature[]> {
    return this.http.get<SavedSignature[]>('/signatures/saved');
  }

  async save(name: string, imageData: string, isDefault = false): Promise<SavedSignature> {
    return this.http.post<SavedSignature>('/signatures/saved', {
      name,
      imageData,
      isDefault,
    });
  }

  async deleteSaved(id: string): Promise<{ message: string }> {
    return this.http.delete(`/signatures/saved/${id}`);
  }

  async sign(
    recipientId: string,
    data: {
      signatureType: string;
      imageData: string;
      fieldValues: Array<{ fieldId: string; value: string }>;
    }
  ): Promise<{ message: string; signedAt: string }> {
    return this.http.post(`/signatures/sign/${recipientId}`, data);
  }

  async decline(recipientId: string, reason: string): Promise<{ message: string }> {
    return this.http.post(`/signatures/decline/${recipientId}`, { reason });
  }
}
