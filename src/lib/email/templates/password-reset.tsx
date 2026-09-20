import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Button,
} from '@react-email/components';
import { EmailTailwind, HEXALOGIC_LOGO, HEXALOGIC_URL } from './theme';

interface PasswordResetEmailProps {
  // Use a fallback for local development preview, but in production this will be replaced by Supabase's templating engine
  confirmationUrl?: string;
}

export const PasswordResetEmail = ({
  confirmationUrl = '{{ .ConfirmationURL }}',
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <EmailTailwind>
        <Body className="bg-[#F8F9FB] font-sans m-0 p-0">
          <Container className="mx-auto py-10 px-4 w-full max-w-[600px]">
            {/* Header / Logo */}
            <Section className="bg-white rounded-t-xl p-8 border border-b-0 border-gray-200 text-center">
              <Text className="text-brand-dark text-2xl font-extrabold tracking-tight m-0 text-center">
                HexaLogic Tech
              </Text>
            </Section>

            {/* Main Content Card */}
            <Section className="bg-white rounded-b-xl p-8 border border-t-0 border-gray-200">
              <Text className="text-brand-dark text-2xl font-bold m-0 mb-6 text-center">
                Reset Your Password
              </Text>

              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-6 text-center">
                We received a request to reset your password for your HexaLogic Portal account.
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={confirmationUrl}
                  className="bg-brand-primary text-white font-bold text-base px-8 py-3.5 rounded-lg text-center cursor-pointer inline-block"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-gray-500 text-sm leading-relaxed m-0 text-center">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center px-4">
              <Text className="text-gray-400 text-xs leading-relaxed m-0">
                © {new Date().getFullYear()} HexaLogic. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </EmailTailwind>
    </Html>
  );
};

export default PasswordResetEmail;
