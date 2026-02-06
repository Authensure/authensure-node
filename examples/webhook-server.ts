import express from 'express';
import Authensure from '@authensure/sdk';

const app = express();
const port = process.env.PORT || 3000;

const authensure = new Authensure({
  apiKey: process.env.AUTHENSURE_API_KEY!,
});

const WEBHOOK_SECRET = process.env.AUTHENSURE_WEBHOOK_SECRET!;

app.post('/webhooks/authensure', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-authensure-signature'] as string;

  if (!signature) {
    console.error('Missing signature header');
    return res.status(400).json({ error: 'Missing signature' });
  }

  try {
    const event = authensure.webhooks.constructEvent(
      req.body,
      signature,
      WEBHOOK_SECRET
    );

    console.log(`\n📥 Received webhook event: ${event.event}`);
    console.log(`   Timestamp: ${event.timestamp}`);
    console.log(`   Data:`, JSON.stringify(event.data, null, 2));

    switch (event.event) {
      case 'envelope.created':
        handleEnvelopeCreated(event.data);
        break;
      case 'envelope.sent':
        handleEnvelopeSent(event.data);
        break;
      case 'envelope.viewed':
        handleEnvelopeViewed(event.data);
        break;
      case 'envelope.signed':
        handleEnvelopeSigned(event.data);
        break;
      case 'envelope.completed':
        handleEnvelopeCompleted(event.data);
        break;
      case 'envelope.declined':
        handleEnvelopeDeclined(event.data);
        break;
      case 'envelope.voided':
        handleEnvelopeVoided(event.data);
        break;
      default:
        console.log(`   Unhandled event type: ${event.event}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook verification failed:', error);
    res.status(400).json({ error: 'Invalid signature' });
  }
});

function handleEnvelopeCreated(data: Record<string, unknown>) {
  console.log('   📄 New envelope created:', data.id);
}

function handleEnvelopeSent(data: Record<string, unknown>) {
  console.log('   📨 Envelope sent for signing:', data.id);
}

function handleEnvelopeViewed(data: Record<string, unknown>) {
  console.log('   👁️ Envelope viewed by recipient');
}

function handleEnvelopeSigned(data: Record<string, unknown>) {
  console.log('   ✍️ Envelope signed by recipient');
}

function handleEnvelopeCompleted(data: Record<string, unknown>) {
  console.log('   ✅ Envelope completed - all signatures collected!');
}

function handleEnvelopeDeclined(data: Record<string, unknown>) {
  console.log('   ❌ Envelope declined by recipient');
}

function handleEnvelopeVoided(data: Record<string, unknown>) {
  console.log('   🚫 Envelope voided');
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`\n🚀 Webhook server listening on port ${port}`);
  console.log(`   Endpoint: http://localhost:${port}/webhooks/authensure`);
  console.log('\nWaiting for webhook events...\n');
});
