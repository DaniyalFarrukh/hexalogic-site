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

interface NewCommentEmailProps {
  projectName: string;
  senderName: string;
  commentPreview: string;
  link: string;
}

export const NewCommentEmail = ({
  projectName = 'Your Project',
  senderName = 'Someone',
  commentPreview = 'Left a comment',
  link = 'https://www.hexalogic.dev/portal',
}: NewCommentEmailProps) => {
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
              <Text className="text-brand-secondary text-sm font-bold uppercase tracking-widest m-0 mb-2 text-center">
                {projectName}
              </Text>
              <Text className="text-brand-dark text-2xl font-bold m-0 mb-6 text-center">
                New message from {senderName}
              </Text>

              <Section className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 relative">
                {/* Quote styling */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-l-xl"></div>
                <Text className="text-gray-600 text-base italic leading-relaxed m-0 whitespace-pre-wrap pl-4">
                  "{commentPreview}"
                </Text>
              </Section>

              <Section className="text-center">
                <Button
                  href={link}
                  className="bg-brand-primary text-white font-bold text-base px-8 py-3.5 rounded-lg text-center cursor-pointer inline-block"
                >
                  Reply in Portal
                </Button>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center px-4">
              <Text className="text-gray-400 text-xs leading-relaxed m-0">
                © {new Date().getFullYear()} HexaLogic. All rights reserved.
              </Text>
              <Text className="text-gray-400 text-xs leading-relaxed m-0 mt-1">
                Manage your notifications at{' '}
                <Link href={`${HEXALOGIC_URL}/portal/settings`} className="text-brand-primary underline">
                  Portal Settings
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </EmailTailwind>
    </Html>
  );
};

export default NewCommentEmail;
