import { HttpClient } from '../http-client';
import type {
  Envelope,
  EnvelopeStatus,
  CreateEnvelopeParams,
  AddRecipientParams,
  Recipient,
} from '../types';

export class EnvelopesResource {
  constructor(private http: HttpClient) {}

  async list(status?: EnvelopeStatus): Promise<Envelope[]> {
    const query = status ? `?status=${status}` : '';
    return this.http.get<Envelope[]>(`/envelopes${query}`);
  }

  async get(id: string): Promise<Envelope> {
    return this.http.get<Envelope>(`/envelopes/${id}`);
  }

  async create(params: CreateEnvelopeParams): Promise<Envelope> {
    return this.http.post<Envelope>('/envelopes', params);
  }

  async update(id: string, data: Partial<{ name: string; message: string }>): Promise<Envelope> {
    return this.http.patch<Envelope>(`/envelopes/${id}`, data);
  }

  async delete(id: string): Promise<{ message: string }> {
    return this.http.delete(`/envelopes/${id}`);
  }

  async addRecipient(envelopeId: string, recipient: AddRecipientParams): Promise<Recipient> {
    return this.http.post<Recipient>(`/envelopes/${envelopeId}/recipients`, recipient);
  }

  async removeRecipient(envelopeId: string, recipientId: string): Promise<{ message: string }> {
    return this.http.delete(`/envelopes/${envelopeId}/recipients/${recipientId}`);
  }

  async send(id: string): Promise<Envelope> {
    return this.http.post<Envelope>(`/envelopes/${id}/send`);
  }

  async void(id: string, reason?: string): Promise<Envelope> {
    return this.http.post<Envelope>(`/envelopes/${id}/void`, { reason });
  }

  async getBySigningToken(token: string): Promise<Envelope> {
    return this.http.get<Envelope>(`/envelopes/sign/${token}`);
  }
}
