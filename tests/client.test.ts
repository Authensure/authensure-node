import { describe, it, expect } from 'vitest';
import { Authensure } from '../src';

describe('Authensure Client', () => {
  it('should create client with API key', () => {
    const client = new Authensure({ apiKey: 'test_api_key' });
    expect(client).toBeInstanceOf(Authensure);
    expect(client.auth).toBeDefined();
    expect(client.envelopes).toBeDefined();
    expect(client.documents).toBeDefined();
    expect(client.templates).toBeDefined();
    expect(client.contacts).toBeDefined();
    expect(client.users).toBeDefined();
    expect(client.organizations).toBeDefined();
    expect(client.webhooks).toBeDefined();
    expect(client.apiKeys).toBeDefined();
    expect(client.teams).toBeDefined();
    expect(client.signatures).toBeDefined();
  });

  it('should create client with access token', () => {
    const client = new Authensure({ accessToken: 'test_token' });
    expect(client).toBeInstanceOf(Authensure);
  });

  it('should throw error without credentials', () => {
    expect(() => new Authensure({})).toThrow('Either apiKey or accessToken must be provided');
  });

  it('should create client using static factory with API key', () => {
    const client = Authensure.createWithApiKey('test_api_key');
    expect(client).toBeInstanceOf(Authensure);
  });

  it('should create client using static factory with token', () => {
    const client = Authensure.createWithToken('test_token');
    expect(client).toBeInstanceOf(Authensure);
  });
});

describe('Auth Resource', () => {
  const client = new Authensure({ apiKey: 'test_api_key' });

  it('should login successfully', async () => {
    const response = await client.auth.login('test@example.com', 'password');
    expect(response.accessToken).toBe('test_access_token');
    expect(response.user.email).toBe('test@example.com');
  });

  it('should register successfully', async () => {
    const response = await client.auth.register({
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
    });
    expect(response.message).toBe('Registration successful');
    expect(response.userId).toBe('user_123');
  });

  it('should get profile', async () => {
    const profile = await client.auth.getProfile();
    expect(profile.email).toBe('test@example.com');
    expect(profile.name).toBe('Test User');
  });
});

describe('Envelopes Resource', () => {
  const client = new Authensure({ apiKey: 'test_api_key' });

  it('should list envelopes', async () => {
    const envelopes = await client.envelopes.list();
    expect(Array.isArray(envelopes)).toBe(true);
    expect(envelopes[0]?.name).toBe('Test Envelope');
  });

  it('should get envelope by id', async () => {
    const envelope = await client.envelopes.get('env_456');
    expect(envelope.id).toBe('env_456');
  });

  it('should create envelope', async () => {
    const envelope = await client.envelopes.create({ name: 'New Envelope' });
    expect(envelope.name).toBe('New Envelope');
  });

  it('should delete envelope', async () => {
    const response = await client.envelopes.delete('env_123');
    expect(response.message).toBe('Deleted');
  });
});

describe('Contacts Resource', () => {
  const client = new Authensure({ apiKey: 'test_api_key' });

  it('should list contacts', async () => {
    const response = await client.contacts.list();
    expect(response.data).toBeDefined();
    expect(response.pagination).toBeDefined();
    expect(response.data[0]?.email).toBe('contact@example.com');
  });

  it('should create contact', async () => {
    const contact = await client.contacts.create({
      email: 'new@example.com',
      name: 'New Contact',
    });
    expect(contact.email).toBe('new@example.com');
  });

  it('should get contact stats', async () => {
    const stats = await client.contacts.getStats();
    expect(stats.total).toBe(100);
    expect(stats.bySource.MANUAL).toBe(20);
  });
});

describe('Users Resource', () => {
  const client = new Authensure({ apiKey: 'test_api_key' });

  it('should get current user profile', async () => {
    const profile = await client.users.getMe();
    expect(profile.email).toBe('test@example.com');
    expect(profile.presenceStatus).toBe('ONLINE');
  });
});

describe('Organizations Resource', () => {
  const client = new Authensure({ apiKey: 'test_api_key' });

  it('should get current organization', async () => {
    const org = await client.organizations.getCurrent();
    expect(org.name).toBe('Test Organization');
    expect(org.slug).toBe('test-org');
  });
});

describe('Templates Resource', () => {
  const client = new Authensure({ apiKey: 'test_api_key' });

  it('should list templates', async () => {
    const templates = await client.templates.list();
    expect(Array.isArray(templates)).toBe(true);
  });
});

describe('Webhooks Resource', () => {
  const client = new Authensure({ apiKey: 'test_api_key' });

  it('should list webhooks', async () => {
    const response = await client.webhooks.list();
    expect(response.webhooks).toBeDefined();
    expect(Array.isArray(response.webhooks)).toBe(true);
  });

  it('should verify webhook signature', () => {
    const payload = JSON.stringify({ event: 'envelope.created', data: {} });
    const secret = 'webhook_secret';
    
    const crypto = require('crypto');
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    
    const isValid = client.webhooks.verifySignature(payload, expectedSignature, secret);
    expect(isValid).toBe(true);
  });

  it('should reject invalid webhook signature', () => {
    const payload = JSON.stringify({ event: 'envelope.created', data: {} });
    const isValid = client.webhooks.verifySignature(payload, 'invalid_signature', 'secret');
    expect(isValid).toBe(false);
  });
});

describe('API Keys Resource', () => {
  const client = new Authensure({ apiKey: 'test_api_key' });

  it('should list API keys', async () => {
    const keys = await client.apiKeys.list();
    expect(Array.isArray(keys)).toBe(true);
  });
});

describe('Teams Resource', () => {
  const client = new Authensure({ apiKey: 'test_api_key' });

  it('should get team members', async () => {
    const response = await client.teams.getMembers();
    expect(response.members).toBeDefined();
    expect(Array.isArray(response.members)).toBe(true);
  });
});

describe('Signatures Resource', () => {
  const client = new Authensure({ apiKey: 'test_api_key' });

  it('should get saved signatures', async () => {
    const signatures = await client.signatures.getSaved();
    expect(Array.isArray(signatures)).toBe(true);
  });
});
