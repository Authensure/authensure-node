# Authensure SDK Examples

This directory contains example code demonstrating how to use the Authensure Node.js SDK.

## Setup

1. Install dependencies:
```bash
cd examples
npm install
```

2. Set your API key:
```bash
export AUTHENSURE_API_KEY=your_api_key_here
```

## Examples

### Basic Usage
Demonstrates core SDK functionality including authentication, envelopes, contacts, and templates.

```bash
npm run basic
```

### Webhook Server
A simple Express server that receives and validates webhook events from Authensure.

```bash
export AUTHENSURE_WEBHOOK_SECRET=your_webhook_secret
npm run webhook
```

### Create Envelope Workflow
Complete workflow demonstrating how to create an envelope, upload a document, add fields, add recipients, and send for signing.

```bash
npm run envelope
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AUTHENSURE_API_KEY` | Your Authensure API key |
| `AUTHENSURE_WEBHOOK_SECRET` | Secret for webhook signature verification |
| `PORT` | Port for the webhook server (default: 3000) |

## Resources

- [SDK Documentation](https://authensure.app/docs/sdk/node)
- [API Reference](https://authensure.app/docs/api)
- [GitHub Repository](https://github.com/Authensure/authensure-node)
