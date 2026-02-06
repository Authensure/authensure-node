import Authensure from '@authensure/sdk';
import { readFileSync } from 'fs';
import { join } from 'path';

async function createEnvelopeWorkflow() {
  const authensure = new Authensure({
    apiKey: process.env.AUTHENSURE_API_KEY!,
    debug: true,
  });

  console.log('📝 Complete Envelope Creation Workflow\n');

  try {
    console.log('Step 1: Create envelope...');
    const envelope = await authensure.envelopes.create({
      name: 'Employment Contract - John Doe',
      message: 'Please review and sign the attached employment contract.',
    });
    console.log(`   ✓ Created envelope: ${envelope.id}\n`);

    console.log('Step 2: Upload document...');
    const pdfPath = join(__dirname, 'sample-contract.pdf');
    let pdfBuffer: Buffer;
    
    try {
      pdfBuffer = readFileSync(pdfPath);
    } catch {
      console.log('   ⚠️ sample-contract.pdf not found, creating placeholder...');
      pdfBuffer = Buffer.from('PDF placeholder for demo');
    }

    const document = await authensure.documents.upload(
      envelope.id,
      pdfBuffer,
      'employment-contract.pdf',
      'application/pdf'
    );
    console.log(`   ✓ Uploaded document: ${document.id}\n`);

    console.log('Step 3: Add signature fields...');
    await authensure.documents.updateFields(document.id, [
      {
        id: 'sig_employee',
        type: 'signature',
        label: 'Employee Signature',
        x: 100,
        y: 650,
        width: 200,
        height: 50,
        page: 1,
        required: true,
      },
      {
        id: 'date_employee',
        type: 'date',
        label: 'Date',
        x: 350,
        y: 650,
        width: 100,
        height: 30,
        page: 1,
        required: true,
      },
      {
        id: 'sig_employer',
        type: 'signature',
        label: 'Employer Signature',
        x: 100,
        y: 720,
        width: 200,
        height: 50,
        page: 1,
        required: true,
      },
    ]);
    console.log('   ✓ Added signature fields\n');

    console.log('Step 4: Add recipients...');
    const employee = await authensure.envelopes.addRecipient(envelope.id, {
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'Employee',
    });
    console.log(`   ✓ Added employee: ${employee.email}`);

    const employer = await authensure.envelopes.addRecipient(envelope.id, {
      email: 'hr@company.com',
      name: 'HR Manager',
      role: 'Employer',
    });
    console.log(`   ✓ Added employer: ${employer.email}\n`);

    console.log('Step 5: Send envelope for signing...');
    const sentEnvelope = await authensure.envelopes.send(envelope.id);
    console.log(`   ✓ Envelope sent! Status: ${sentEnvelope.status}\n`);

    console.log('📧 Signing emails have been sent to:');
    console.log('   - john.doe@example.com');
    console.log('   - hr@company.com\n');

    console.log('✅ Workflow completed successfully!');
    console.log(`   Envelope ID: ${envelope.id}`);
    console.log(`   Track status at: https://authensure.app/dashboard/envelopes/${envelope.id}`);

    return envelope;
  } catch (error) {
    console.error('❌ Workflow failed:', error);
    throw error;
  }
}

createEnvelopeWorkflow();
