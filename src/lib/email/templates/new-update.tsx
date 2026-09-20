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
  Hr,
} from '@react-email/components';
import { EmailTailwind, HEXALOGIC_LOGO, HEXALOGIC_URL } from './theme';

interface NewUpdateEmailProps {
  projectName: string;
  updateTitle: string;
  updateBody: string;
  progressPercent: number;
  thumbnailUrl?: string;
  updateLink: string;
}

export const NewUpdateEmail = ({
  projectName = 'Your Project',
  updateTitle = 'Made Changes in UI',
  updateBody = 'We have updated the design and added new components.',
  progressPercent = 50,
  thumbnailUrl,
  updateLink = 'https://www.hexalogic.dev/portal',
}: NewUpdateEmailProps) => {
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
                {updateTitle}
              </Text>

              {thumbnailUrl && (
                <Img
                  src={thumbnailUrl}
                  width="100%"
                  alt="Update preview"
                  className="rounded-lg shadow-sm mb-6 border border-gray-100"
                />
              )}

              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-8 whitespace-pre-wrap">
                {updateBody}
              </Text>

              {/* Progress Bar Section */}
              <Section className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                <Text className="text-brand-dark text-sm font-bold m-0 mb-3 text-center">
                  Project Progress: {progressPercent}%
                </Text>
                <table width="100%" cellPadding="0" cellSpacing="0" border={0} className="w-full">
                  <tr>
                    <td
                      width={`${progressPercent}%`}
                      className="bg-brand-primary h-2 rounded-l-full"
                      style={{ borderRadius: progressPercent === 100 ? '9999px' : '9999px 0 0 9999px' }}
                    ></td>
                    <td
                      width={`${100 - progressPercent}%`}
                      className="bg-gray-200 h-2 rounded-r-full"
                      style={{ borderRadius: progressPercent === 0 ? '9999px' : '0 9999px 9999px 0' }}
                    ></td>
                  </tr>
                </table>
              </Section>

              <Section className="text-center">
                <Button
                  href={updateLink}
                  className="bg-brand-primary text-white font-bold text-base px-8 py-3.5 rounded-lg text-center cursor-pointer inline-block"
                >
                  View Update in Portal
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

export default NewUpdateEmail;
