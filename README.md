# Authensure Node.js SDK

[![npm version](https://badge.fury.io/js/@synoryx_labs%2Fauthensure-sdk.svg)](https://www.npmjs.com/package/@synoryx_labs/authensure-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Node.js SDK for [Authensure](https://authensure.app) - the electronic signature and document authentication platform.

## Features

- 🔐 **Full API Coverage** - Access all Authensure API endpoints
- 📝 **TypeScript Support** - Complete type definitions included
- 🔄 **Automatic Retries** - Built-in exponential backoff for transient errors
- ⚡ **Rate Limit Handling** - Automatic rate limit detection and backoff
- 🔗 **Webhook Verification** - Easy webhook signature verification
- 📁 **File Uploads** - Simplified document upload handling
- 🐛 **Debug Mode** - Detailed logging for development

## Installation

```bash
npm install @synoryx_labs/authensure-sdk
```

Or with yarn:

```bash
yarn add @synoryx_labs/authensure-sdk
```

## Quick Start

```typescript
import Authensure from '@synoryx_labs/authensure-sdk';

// Initialize with API key
const authensure = new Authensure({
  apiKey: 'your_api_key_here',
});

// Or with access token
const authensure = Authensure.createWithToken('your_access_token');

// Create an envelope
const envelope = await authensure.envelopes.create({
  name: 'Contract Agreement',
  message: 'Please sign this document',
});

// Add a recipient
await authensure.envelopes.addRecipient(envelope.id, {
  email: 'signer@example.com',
  name: 'John Doe',
  role: 'signer',
});

// Send for signing
await authensure.envelopes.send(envelope.id);
```

## Authentication

### Using API Key

```typescript
const authensure = new Authensure({
  apiKey: process.env.AUTHENSURE_API_KEY,
});
```

### Using Email/Password Login

```typescript
const authensure = new Authensure({
  accessToken: 'temporary', // Will be replaced after login
});

const { accessToken, user } = await authensure.auth.login(
  'user@example.com',
  'password'
);

// Token is automatically set for subsequent requests
```

## Configuration Options

```typescript
const authensure = new Authensure({
  apiKey: 'your_api_key',           // API key for authentication
  accessToken: 'your_token',        // JWT access token
  baseUrl: 'https://api.authensure.app/api', // API base URL
  timeout: 30000,                   // Request timeout in ms (default: 30000)
  retryAttempts: 3,                 // Number of retry attempts (default: 3)
  retryDelay: 1000,                 // Initial retry delay in ms (default: 1000)
  debug: false,                     // Enable debug logging (default: false)
});
```

## API Reference

### Envelopes

```typescript
// List all envelopes
const envelopes = await authensure.envelopes.list();

// Filter by status
const drafts = await authensure.envelopes.list('DRAFT');

// Get single envelope
const envelope = await authensure.envelopes.get('envelope_id');

// Create envelope
const newEnvelope = await authensure.envelopes.create({
  name: 'Contract',
  message: 'Please review and sign',
});

// Update envelope
await authensure.envelopes.update('envelope_id', { name: 'Updated Name' });

// Add recipient
await authensure.envelopes.addRecipient('envelope_id', {
  email: 'signer@example.com',
  name: 'John Doe',
  role: 'signer',
});

// Remove recipient
await authensure.envelopes.removeRecipient('envelope_id', 'recipient_id');

// Send envelope for signing
await authensure.envelopes.send('envelope_id');

// Void envelope
await authensure.envelopes.void('envelope_id', 'Reason for voiding');

// Delete envelope
await authensure.envelopes.delete('envelope_id');
```

### Documents

```typescript
import { readFileSync } from 'fs';

// List documents
const documents = await authensure.documents.list();

// Upload document to envelope
const pdfBuffer = readFileSync('contract.pdf');
const document = await authensure.documents.upload(
  'envelope_id',
  pdfBuffer,
  'contract.pdf',
  'application/pdf'
);

// Get document
const doc = await authensure.documents.get('document_id');

// Get signed URL for document
const { url } = await authensure.documents.getSignedUrl('document_id');

// Update document fields
await authensure.documents.updateFields('document_id', [
  { id: 'field_1', type: 'signature', x: 100, y: 200, width: 150, height: 50, page: 1, required: true },
]);

// Delete document
await authensure.documents.delete('document_id');
```

### Templates

```typescript
// List templates
const templates = await authensure.templates.list();

// Get template
const template = await authensure.templates.get('template_id');

// Create template
const newTemplate = await authensure.templates.create({
  name: 'NDA Template',
  description: 'Standard NDA',
});

// Upload document to template
const document = await authensure.templates.uploadDocument(
  'template_id',
  pdfBuffer,
  'nda.pdf'
);

// Add role to template
await authensure.templates.addRole('template_id', 'Signer', 1);

// Use template to create envelope
const envelope = await authensure.templates.use('template_id', {
  name: 'NDA - Acme Corp',
  recipients: [
    { roleId: 'role_id', email: 'signer@acme.com', name: 'Jane Smith' },
  ],
});

// Get marketplace templates
const marketplace = await authensure.templates.getMarketplace('legal');
```

### Contacts

```typescript
// List contacts with pagination
const { data, pagination } = await authensure.contacts.list({
  search: 'john',
  source: 'MANUAL',
  page: 1,
  limit: 50,
});

// Get contact
const contact = await authensure.contacts.get('contact_id');

// Create contact
const newContact = await authensure.contacts.create({
  email: 'contact@example.com',
  name: 'Jane Doe',
  company: 'Acme Corp',
  phone: '+1234567890',
  notes: 'Key decision maker',
});

// Update contact
await authensure.contacts.update('contact_id', {
  company: 'New Company',
});

// Delete contact
await authensure.contacts.delete('contact_id');

// Get contact statistics
const stats = await authensure.contacts.getStats();
console.log(`Total contacts: ${stats.total}`);
```

### Users

```typescript
// Get current user profile
const profile = await authensure.users.getMe();

// Update profile
await authensure.users.updateMe({
  name: 'New Name',
  company: 'New Company',
  jobTitle: 'CEO',
});

// Upload avatar
await authensure.users.uploadAvatar(imageBuffer, 'avatar.png', 'image/png');

// Delete avatar
await authensure.users.deleteAvatar();

// Update presence status
await authensure.users.updatePresence('ONLINE');

// Get user settings
const settings = await authensure.users.getSettings();

// Update settings
await authensure.users.updateSettings({ theme: 'dark' });
```

### Organizations

```typescript
// Get current organization
const org = await authensure.organizations.getCurrent();

// Update organization
await authensure.organizations.updateCurrent({
  name: 'New Name',
  website: 'https://example.com',
});

// Update settings
await authensure.organizations.updateSettings({
  requireMfa: true,
  sessionTimeout: 3600,
});

// Get/update storage preference
const { preference } = await authensure.organizations.getStoragePreference();
await authensure.organizations.updateStoragePreference('GOOGLE_DRIVE');
```

### Teams

```typescript
// Get team members
const { members } = await authensure.teams.getMembers();

// Invite new member
const invitation = await authensure.teams.inviteMember({
  email: 'newuser@example.com',
  role: 'USER',
});

// Get pending invitations
const { invitations } = await authensure.teams.getPendingInvitations();

// Cancel invitation
await authensure.teams.cancelInvitation('invitation_id');

// Resend invitation
await authensure.teams.resendInvitation('invitation_id');

// Update member role
await authensure.teams.updateMemberRole('member_id', 'ADMIN');

// Remove member
await authensure.teams.removeMember('member_id');

// Suspend/reactivate member
await authensure.teams.suspendMember('member_id');
await authensure.teams.reactivateMember('member_id');
```

### Webhooks

```typescript
// List webhooks
const { webhooks } = await authensure.webhooks.list();

// Create webhook
const webhook = await authensure.webhooks.create({
  url: 'https://your-server.com/webhooks/authensure',
  events: ['envelope.completed', 'envelope.signed'],
});

// Update webhook
await authensure.webhooks.update('webhook_id', {
  events: ['envelope.completed'],
  isActive: true,
});

// Test webhook
const result = await authensure.webhooks.test('webhook_id');

// Get delivery history
const { deliveries } = await authensure.webhooks.getDeliveries('webhook_id');

// Retry failed delivery
await authensure.webhooks.retryDelivery('webhook_id', 'delivery_id');

// Delete webhook
await authensure.webhooks.delete('webhook_id');

// Verify webhook signature (in your webhook handler)
const isValid = authensure.webhooks.verifySignature(
  rawBody,
  request.headers['x-authensure-signature'],
  'your_webhook_secret'
);

// Construct and parse webhook event
const event = authensure.webhooks.constructEvent(
  rawBody,
  signature,
  'your_webhook_secret'
);
console.log(`Received event: ${event.event}`);
```

### API Keys

```typescript
// List API keys
const keys = await authensure.apiKeys.list();

// Create API key
const { key, ...keyData } = await authensure.apiKeys.create({
  name: 'Production Key',
  permissions: ['envelopes:read', 'envelopes:write'],
  rateLimit: 1000,
  expiresAt: '2025-12-31T23:59:59Z',
});
console.log(`New key: ${key}`); // Only shown once!

// Regenerate key
const newKey = await authensure.apiKeys.regenerate('key_id');

// Delete key
await authensure.apiKeys.delete('key_id');

// Get usage stats
const stats = await authensure.apiKeys.getStats();
```

### Signatures

```typescript
// Get saved signatures
const signatures = await authensure.signatures.getSaved();

// Save a new signature
const saved = await authensure.signatures.save(
  'My Signature',
  'data:image/png;base64,...',
  true // isDefault
);

// Delete saved signature
await authensure.signatures.deleteSaved('signature_id');
```

## Error Handling

```typescript
import {
  Authensure,
  AuthensureError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError,
  NetworkError,
  TimeoutError,
} from '@synoryx_labs/authensure-sdk';

try {
  await authensure.envelopes.get('invalid_id');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Envelope not found');
  } else if (error instanceof AuthenticationError) {
    console.log('Authentication failed - check your API key');
  } else if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error instanceof ValidationError) {
    console.log('Validation errors:', error.validationErrors);
  } else if (error instanceof NetworkError) {
    console.log('Network error:', error.message);
  } else if (error instanceof TimeoutError) {
    console.log('Request timed out');
  } else if (error instanceof AuthensureError) {
    console.log(`Error ${error.code}: ${error.message}`);
  }
}
```

## Webhook Handler Example (Express)

```typescript
import express from 'express';
import { Authensure } from '@synoryx_labs/authensure-sdk';

const app = express();
const authensure = new Authensure({ apiKey: process.env.AUTHENSURE_API_KEY });

app.post('/webhooks/authensure', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-authensure-signature'] as string;
  
  try {
    const event = authensure.webhooks.constructEvent(
      req.body,
      signature,
      process.env.AUTHENSURE_WEBHOOK_SECRET!
    );

    switch (event.event) {
      case 'envelope.completed':
        console.log('Envelope completed:', event.data);
        break;
      case 'envelope.signed':
        console.log('Envelope signed:', event.data);
        break;
      default:
        console.log(`Unhandled event: ${event.event}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Invalid signature' });
  }
});
```

## TypeScript Support

This SDK is written in TypeScript and includes full type definitions:

```typescript
import Authensure, {
  Envelope,
  Document,
  Template,
  Contact,
  User,
  Organization,
  Webhook,
  WebhookEvent,
  EnvelopeStatus,
  UserRole,
  AuthensureConfig,
} from '@synoryx_labs/authensure-sdk';

// All types are available for use
const config: AuthensureConfig = {
  apiKey: 'your_key',
  debug: true,
};

const handleEnvelope = (envelope: Envelope) => {
  console.log(`Envelope ${envelope.id}: ${envelope.status}`);
};
```

## Debug Mode

Enable debug mode to see detailed request/response logging:

```typescript
const authensure = new Authensure({
  apiKey: 'your_key',
  debug: true,
});

// Logs will show:
// [Authensure SDK] POST /envelopes { name: 'Test' }
// [Authensure SDK] Response 201 { id: 'env_123', ... }
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- 📧 Email: support@authensure.app
- 📚 Documentation: https://authensure.app/docs
- 🐛 Issues: https://github.com/Authensure/authensure-node/issues
