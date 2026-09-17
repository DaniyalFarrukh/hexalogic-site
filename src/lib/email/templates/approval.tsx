import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Button
} from '@react-email/components';
import { emailStyles as styles } from './styles';

interface ApprovalEmailProps {
  clientName: string;
  projectName: string;
  milestoneName: string;
  isApproved: boolean;
  note?: string;
  adminLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const ApprovalEmail = ({
  clientName,
  projectName,
  milestoneName,
  isApproved,
  note,
  adminLink,
}: ApprovalEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.card}>
            <Img
              src={`${baseUrl}/logo-email.png`}
              width="150"
              alt="HexaLogic"
              style={styles.logo}
            />
            <Text style={styles.h2}>{projectName}</Text>
            <Text style={styles.h1}>
              {isApproved ? 'Milestone Approved! 🎉' : 'Changes Requested'}
            </Text>
            
            <Text style={styles.text}>
              <span style={styles.bold}>{clientName}</span> has {isApproved ? 'approved' : 'requested changes to'} the milestone: <span style={styles.bold}>{milestoneName}</span>.
            </Text>

            {note && (
              <Section style={{ margin: '24px 0', padding: '16px', backgroundColor: '#F8F9FB', borderLeft: `4px solid ${isApproved ? '#1BB8A3' : '#3B82F6'}` }}>
                <Text style={{ margin: 0, color: '#5B6B7C', fontSize: '15px', fontStyle: 'italic' }}>
                  &ldquo;{note}&rdquo;
                </Text>
              </Section>
            )}

            <Section style={styles.buttonContainer}>
              <Button href={adminLink} style={styles.button}>
                View in Admin Portal
              </Button>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ApprovalEmail;
