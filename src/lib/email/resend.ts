import { Resend } from 'resend';
import { render } from '@react-email/components';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');
const isDev = !process.env.RESEND_API_KEY;

export async function sendEmail({
  to,
  subject,
  template,
}: {
  to: string | string[];
  subject: string;
  template: React.ReactElement;
}) {
  try {
    const html = await render(template);
    const text = await render(template, { plainText: true });

    if (isDev) {
      console.log('--- DEV MODE: Email Sent ---');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('--- Text Version ---');
      console.log(text);
      console.log('----------------------------');
      return { success: true, message: 'Logged to console (Dev mode)' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'HexaLogic <portal@hexalogic.com>',
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
