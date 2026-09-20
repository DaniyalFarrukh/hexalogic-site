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

interface ProjectCompleteEmailProps {
  projectName: string;
  portalLink: string;
}

export const ProjectCompleteEmail = ({
  projectName = 'Your Project',
  portalLink = 'https://www.hexalogic.dev/portal',
}: ProjectCompleteEmailProps) => {
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
                Project Complete! 🎉
              </Text>

              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-6 text-center">
                We're thrilled to announce that all milestones for your project have been successfully completed. 
                Thank you for partnering with HexaLogic!
              </Text>

              <Text className="text-gray-600 text-base leading-relaxed m-0 mb-8 text-center">
                You can review all the final deliverables, documentation, and files in your client portal.
              </Text>

              <Section className="text-center">
                <Button
                  href={portalLink}
                  className="bg-brand-primary text-white font-bold text-base px-8 py-3.5 rounded-lg text-center cursor-pointer inline-block"
                >
                  View Final Project
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

export default ProjectCompleteEmail;
