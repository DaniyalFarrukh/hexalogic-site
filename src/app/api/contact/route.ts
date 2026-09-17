import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rate-limit';

// Supabase setup (optional persistence of inquiries)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const MAX_MESSAGE_LENGTH = 5000;
const MAX_NAME_LENGTH = 120;
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'application/zip',
  'application/x-zip-compressed',
]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function singleLine(value: string) {
  return value.replace(/[\r\n"]/g, ' ').trim();
}

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown; // honeypot field, must stay empty
  file?: { name?: unknown; type?: unknown; data?: unknown } | null;
};

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
  const { success, retryAfter } = rateLimit(`contact_${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: `Too many messages sent. Please try again in ${Math.ceil(retryAfter / 60)} minutes.` },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  let payload: ContactPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
  }
  if (name.length > MAX_NAME_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: 'Your message is too long' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
  }

  // Validate the optional attachment
  let attachment: { filename: string; content: string; encoding: 'base64'; contentType: string } | null = null;
  if (payload.file && typeof payload.file === 'object') {
    const fileName = typeof payload.file.name === 'string' ? payload.file.name : '';
    const fileType = typeof payload.file.type === 'string' ? payload.file.type : '';
    const fileData = typeof payload.file.data === 'string' ? payload.file.data : '';
    const base64 = fileData.includes('base64,') ? fileData.split('base64,')[1] : '';

    if (!fileName || !base64) {
      return NextResponse.json({ error: 'Attachment could not be read' }, { status: 400 });
    }
    if (!ALLOWED_ATTACHMENT_TYPES.has(fileType)) {
      return NextResponse.json({ error: 'Attachment type not allowed' }, { status: 400 });
    }
    const approxBytes = Math.floor((base64.length * 3) / 4);
    if (approxBytes > MAX_ATTACHMENT_BYTES) {
      return NextResponse.json({ error: 'Attachment must be under 2MB' }, { status: 400 });
    }
    attachment = {
      filename: fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100),
      content: base64,
      encoding: 'base64',
      contentType: fileType,
    };
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Contact form: GMAIL_USER / GMAIL_APP_PASSWORD are not configured');
    return NextResponse.json(
      { error: 'Messaging is temporarily unavailable. Please email us directly.' },
      { status: 503 }
    );
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    // 1. Persist the inquiry (best effort)
    if (supabase) {
      const { error } = await supabase.from('contacts').insert([{ name, email, message }]);
      if (error) console.error('Contact form: failed to store inquiry', error.message);
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
    const headerName = singleLine(name);

    // 2. Notify the team
    await transporter.sendMail({
      from: `"${headerName}" <${process.env.GMAIL_USER}>`,
      replyTo: email,
      to: process.env.GMAIL_USER,
      subject: `New Contact Inquiry from ${headerName}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h3>New Contact Inquiry</h3>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${safeMessage}</p>
        </div>
      `,
      ...(attachment ? { attachments: [attachment] } : {}),
    });

    // 3. Auto-reply to the sender
    await transporter.sendMail({
      from: `"HexaLogic Tech" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting HexaLogic, ${headerName}!`,
      text: `Hi ${name},\n\nThank you for reaching out to HexaLogic. We have received your message and our team will be reviewing it shortly. One of our specialists will get back to you within 24 hours.\n\nBest regards,\nThe HexaLogic Team`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #FF7324; margin-top: 0;">Thank You for Reaching Out!</h2>
          <p>Hi ${safeName},</p>
          <p>We have received your message and are thrilled you are interested in working with HexaLogic. One of our specialists will review your inquiry and get back to you within 24 hours.</p>
          <p>Here is a copy of your message:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; font-style: italic; margin-bottom: 20px; border-left: 4px solid #FF7324;">
            ${safeMessage}
          </div>
          <p>If you have any immediate details to add, feel free to reply directly to this email.</p>
          <br/>
          <p>Best regards,<br/><strong style="color: #0f2c4c;">The HexaLogic Team</strong></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Contact form: failed to send', error);
    return NextResponse.json(
      { error: 'We could not send your message right now. Please try again shortly.' },
      { status: 500 }
    );
  }
}
