import Authensure from '@authensure/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  const authensure = new Authensure({
    apiKey: process.env.AUTHENSURE_API_KEY!,
    debug: true,
  });

  console.log('🔐 Authensure SDK Example\n');

  try {
    console.log('1. Getting user profile...');
    const profile = await authensure.users.getMe();
    console.log(`   Welcome, ${profile.name}!\n`);

    console.log('2. Listing envelopes...');
    const envelopes = await authensure.envelopes.list();
    console.log(`   Found ${envelopes.length} envelopes\n`);

    console.log('3. Creating a new envelope...');
    const envelope = await authensure.envelopes.create({
      name: 'SDK Test Envelope',
      message: 'Created via Authensure Node.js SDK',
    });
    console.log(`   Created envelope: ${envelope.id}\n`);

    console.log('4. Adding a recipient...');
    const recipient = await authensure.envelopes.addRecipient(envelope.id, {
      email: 'recipient@example.com',
      name: 'Test Recipient',
      role: 'signer',
    });
    console.log(`   Added recipient: ${recipient.email}\n`);

    console.log('5. Getting contact stats...');
    const stats = await authensure.contacts.getStats();
    console.log(`   Total contacts: ${stats.total}`);
    console.log(`   Added in last 24h: ${stats.addedLast24h}\n`);

    console.log('6. Listing templates...');
    const templates = await authensure.templates.list();
    console.log(`   Found ${templates.length} templates\n`);

    console.log('7. Getting organization info...');
    const org = await authensure.organizations.getCurrent();
    console.log(`   Organization: ${org.name}\n`);

    console.log('8. Cleaning up - deleting test envelope...');
    await authensure.envelopes.delete(envelope.id);
    console.log('   Deleted test envelope\n');

    console.log('✅ All operations completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
