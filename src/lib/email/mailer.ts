import nodemailer from 'nodemailer'
import { render } from '@react-email/components'
import React from 'react'

// Same GMAIL_USER / GMAIL_APP_PASSWORD the contact form (src/app/api/contact/route.ts)
// already uses, so there's one set of email credentials for the whole app.
const isDev = !process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD

const transporter = isDev
  ? null
  : nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

export async function sendEmail({
  to,
  subject,
  template,
}: {
  to: string | string[]
  subject: string
  template: React.ReactElement
}) {
  try {
    const html = await render(template)
    const text = await render(template, { plainText: true })

    if (!transporter) {
      console.log('--- DEV MODE: Email Sent ---')
      console.log(`To: ${to}`)
      console.log(`Subject: ${subject}`)
      console.log('--- Text Version ---')
      console.log(text)
      console.log('----------------------------')
      return { success: true, message: 'Logged to console (Dev mode)' }
    }

    // Gmail SMTP always sends as the authenticated account — a display name is
    // fine, but the address itself can't be arbitrary the way it could with Resend,
    // unless GMAIL_USER is a "Send As" alias configured in Gmail's own settings.
    await transporter.sendMail({
      from: `"HexaLogic" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}
