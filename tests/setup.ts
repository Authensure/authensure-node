import { beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const mockUser = {
  id: 'user_123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  emailVerified: true,
  phoneVerified: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockEnvelope = {
  id: 'env_123',
  name: 'Test Envelope',
  status: 'DRAFT',
  organizationId: 'org_123',
  createdById: 'user_123',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  documents: [],
  recipients: [],
};

const mockContact = {
  id: 'contact_123',
  email: 'contact@example.com',
  name: 'Test Contact',
  source: 'MANUAL',
  organizationId: 'org_123',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

export const handlers = [
  http.post('https://api.authensure.app/api/auth/login', () => {
    return HttpResponse.json({
      accessToken: 'test_access_token',
      user: mockUser,
    });
  }),

  http.post('https://api.authensure.app/api/auth/register', () => {
    return HttpResponse.json({
      message: 'Registration successful',
      userId: 'user_123',
    });
  }),

  http.get('https://api.authensure.app/api/auth/profile', () => {
    return HttpResponse.json(mockUser);
  }),

  http.get('https://api.authensure.app/api/envelopes', () => {
    return HttpResponse.json([mockEnvelope]);
  }),

  http.get('https://api.authensure.app/api/envelopes/:id', ({ params }) => {
    return HttpResponse.json({ ...mockEnvelope, id: params.id });
  }),

  http.post('https://api.authensure.app/api/envelopes', async ({ request }) => {
    const body = await request.json() as { name: string };
    return HttpResponse.json({ ...mockEnvelope, ...body }, { status: 201 });
  }),

  http.delete('https://api.authensure.app/api/envelopes/:id', () => {
    return HttpResponse.json({ message: 'Deleted' });
  }),

  http.get('https://api.authensure.app/api/contacts', () => {
    return HttpResponse.json({
      data: [mockContact],
      pagination: { page: 1, limit: 50, total: 1, totalPages: 1 },
    });
  }),

  http.post('https://api.authensure.app/api/contacts', async ({ request }) => {
    const body = await request.json() as { name: string; email: string };
    return HttpResponse.json({ ...mockContact, ...body }, { status: 201 });
  }),

  http.get('https://api.authensure.app/api/contacts/stats', () => {
    return HttpResponse.json({
      total: 100,
      bySource: { ENVELOPE: 50, PUBLIC_FORM: 30, MANUAL: 20 },
      addedLast24h: 5,
      change24h: 2,
      changePercent: 2.5,
    });
  }),

  http.get('https://api.authensure.app/api/templates', () => {
    return HttpResponse.json([]);
  }),

  http.get('https://api.authensure.app/api/webhooks', () => {
    return HttpResponse.json({ webhooks: [] });
  }),

  http.get('https://api.authensure.app/api/api-keys', () => {
    return HttpResponse.json([]);
  }),

  http.get('https://api.authensure.app/api/teams/members', () => {
    return HttpResponse.json({ members: [] });
  }),

  http.get('https://api.authensure.app/api/users/profile/me', () => {
    return HttpResponse.json({ ...mockUser, presenceStatus: 'ONLINE' });
  }),

  http.get('https://api.authensure.app/api/organizations/current', () => {
    return HttpResponse.json({
      id: 'org_123',
      name: 'Test Organization',
      slug: 'test-org',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    });
  }),

  http.get('https://api.authensure.app/api/signatures/saved', () => {
    return HttpResponse.json([]);
  }),
];

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
