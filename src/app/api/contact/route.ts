import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Your App Password
  },
});

export async function POST(req: Request) {
  try {
    const { name, email, message, file } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 1. (Optional) Save to Supabase contacts table
    if (supabase) {
      try {
        const { error } = await supabase
          .from('contacts')
          .insert([{ name, email, message }]);

        if (error) {
          console.error("❌ SUPABASE INSERT ERROR:", error.message, error.details, error.hint);
        } else {
          console.log("✅ Supabase insert successful");
        }
      } catch (err) {
        console.error("❌ SUPABASE EXCEPTION:", err);
      }
    }

    // 2. Send email to the company/team
    const teamMailOptions = {
      from: `"${name}" <${process.env.GMAIL_USER}>`,
      replyTo: email,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: `New Contact Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h3>New Contact Inquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
      ...(file && {
        attachments: [
          {
            filename: file.name,
            content: file.data.split("base64,")[1],
            encoding: 'base64'
          }
        ]
      })
    };

    // 3. Send automated reply to the client
    const clientMailOptions = {
      from: `"HexaLogic Tech" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting HexaLogic, ${name}!`,
      text: `Hi ${name},\n\nThank you for reaching out to HexaLogic. We have received your message and our team will be reviewing it shortly. One of our specialists will get back to you within 24 hours.\n\nBest regards,\nThe HexaLogic Team`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #00C2B8; margin-top: 0;">Thank You for Reaching Out!</h2>
          <p>Hi ${name},</p>
          <p>We've received your message and are thrilled you're interested in working with HexaLogic. One of our specialists will review your inquiry and get back to you within 24 hours.</p>
          <p>Here is a copy of your message:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; font-style: italic; margin-bottom: 20px; border-left: 4px solid #00C2B8;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p>If you have any immediate details to add, feel free to reply directly to this email!</p>
          <br/>
          <p>Best regards,<br/><strong style="color: #0f2c4c;">The HexaLogic Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(teamMailOptions);
    await transporter.sendMail(clientMailOptions);

    return NextResponse.json({ success: true, message: 'Emails sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error("API Contact Error:", error);
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}
