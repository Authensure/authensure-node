import { HttpClient } from '../http-client';
import type {
  Webhook,
  WebhookEvent,
  WebhookDelivery,
  CreateWebhookParams,
  UpdateWebhookParams,
} from '../types';
import { createHmac } from 'crypto';

export class WebhooksResource {
  constructor(private http: HttpClient) {}

  async list(): Promise<{ webhooks: Webhook[] }> {
    return this.http.get<{ webhooks: Webhook[] }>('/webhooks');
  }

  async get(id: string): Promise<Webhook> {
    return this.http.get<Webhook>(`/webhooks/${id}`);
  }

  async create(params: CreateWebhookParams): Promise<Webhook> {
    return this.http.post<Webhook>('/webhooks', params);
  }

  async update(id: string, params: UpdateWebhookParams): Promise<Webhook> {
    return this.http.patch<Webhook>(`/webhooks/${id}`, params);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    return this.http.delete(`/webhooks/${id}`);
  }

  async test(id: string): Promise<{ success: boolean; statusCode?: number; error?: string }> {
    return this.http.post(`/webhooks/${id}/test`);
  }

  async getDeliveries(webhookId: string): Promise<{ deliveries: WebhookDelivery[] }> {
    return this.http.get<{ deliveries: WebhookDelivery[] }>(`/webhooks/${webhookId}/deliveries`);
  }

  async retryDelivery(webhookId: string, deliveryId: string): Promise<{ success: boolean }> {
    return this.http.post(`/webhooks/${webhookId}/deliveries/${deliveryId}/retry`);
  }

  async getAvailableEvents(): Promise<{ events: WebhookEvent[] }> {
    return this.http.get<{ events: WebhookEvent[] }>('/webhooks/events');
  }

  verifySignature(payload: string | Buffer, signature: string, secret: string): boolean {
    const payloadString = typeof payload === 'string' ? payload : payload.toString('utf8');
    const expectedSignature = createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');
    
    const signatureValue = signature.startsWith('sha256=') 
      ? signature.slice(7) 
      : signature;
    
    return expectedSignature === signatureValue;
  }

  constructEvent(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): { event: WebhookEvent; data: Record<string, unknown>; timestamp: string } {
    if (!this.verifySignature(payload, signature, secret)) {
      throw new Error('Invalid webhook signature');
    }

    const payloadString = typeof payload === 'string' ? payload : payload.toString('utf8');
    const parsed = JSON.parse(payloadString) as {
      event: WebhookEvent;
      data: Record<string, unknown>;
      timestamp: string;
    };

    return parsed;
  }
}
