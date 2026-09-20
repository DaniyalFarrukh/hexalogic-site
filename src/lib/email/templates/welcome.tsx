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

interface WelcomeEmailProps {
  email: string;
  password?: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({
  email = 'client@example.com',
  password = 'temporary-password',
  loginUrl = 'https://www.hexalogic.dev/portal/login',
}: WelcomeEmailProps) => {
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
                Welcome to HexaLogic
              </Text>

              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-6">
                Your client portal account has been successfully created. You can log in using your email address <span className="font-bold text-brand-dark">{email}</span> and the temporary password below:
              </Text>

              {password && (
                <Section className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200 text-center">
                  <Text className="text-brand-dark font-mono text-xl tracking-widest font-bold m-0">
                    {password}
                  </Text>
                </Section>
              )}

              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-8">
                Please change this password immediately after logging in for the first time.
              </Text>

              <Section className="text-center">
                <Button
                  href={loginUrl}
                  className="bg-brand-primary text-white font-bold text-base px-8 py-3.5 rounded-lg text-center cursor-pointer inline-block"
                >
                  Log In Now
                </Button>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center px-4">
              <Text className="text-gray-400 text-xs leading-relaxed m-0">
                © {new Date().getFullYear()} HexaLogic. All rights reserved.
              </Text>
              <Text className="text-gray-400 text-xs leading-relaxed m-0 mt-1">
                If you didn't request this email, please ignore it or contact support.
              </Text>
            </Section>
          </Container>
        </Body>
      </EmailTailwind>
    </Html>
  );
};

export default WelcomeEmail;
