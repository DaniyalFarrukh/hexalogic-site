import { render } from '@react-email/components';
import React from 'react';
import fs from 'fs';
import path from 'path';

// Need to import the templates directly to render them
// Since this is a script, we will use ts-node to run it
import { PasswordResetEmail } from '../src/lib/email/templates/password-reset';
import { WelcomeEmail } from '../src/lib/email/templates/welcome';

async function exportEmails() {
  console.log('Rendering Password Reset Email...');
  const passwordResetHtml = await render(React.createElement(PasswordResetEmail, {}));
  
  // Create output directory if it doesn't exist
  const outDir = path.join(process.cwd(), 'email-exports');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  // Write to files
  fs.writeFileSync(path.join(outDir, 'password-reset.html'), passwordResetHtml);
  
  console.log(`\nSuccess! Email HTML exported to ${outDir}`);
  console.log('You can now copy the contents of these files into the Supabase Dashboard.');
}

exportEmails().catch(console.error);
