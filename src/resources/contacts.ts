import { HttpClient } from '../http-client';
import type {
  Contact,
  ContactStats,
  ContactSource,
  CreateContactParams,
  UpdateContactParams,
  PaginatedResponse,
} from '../types';

export interface ListContactsParams {
  search?: string;
  source?: ContactSource;
  page?: number;
  limit?: number;
}

export class ContactsResource {
  constructor(private http: HttpClient) {}

  async list(params?: ListContactsParams): Promise<PaginatedResponse<Contact>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.source) searchParams.set('source', params.source);
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.http.get<PaginatedResponse<Contact>>(`/contacts${query ? `?${query}` : ''}`);
  }

  async get(id: string): Promise<Contact> {
    return this.http.get<Contact>(`/contacts/${id}`);
  }

  async create(params: CreateContactParams): Promise<Contact> {
    return this.http.post<Contact>('/contacts', params);
  }

  async update(id: string, params: UpdateContactParams): Promise<Contact> {
    return this.http.patch<Contact>(`/contacts/${id}`, params);
  }

  async delete(id: string): Promise<{ message: string }> {
    return this.http.delete(`/contacts/${id}`);
  }

  async getStats(): Promise<ContactStats> {
    return this.http.get<ContactStats>('/contacts/stats');
  }
}
