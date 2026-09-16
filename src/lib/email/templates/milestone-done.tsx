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
  Button
} from '@react-email/components';
import { emailStyles as styles } from './styles';

interface MilestoneDoneEmailProps {
  projectName: string;
  milestoneName: string;
  nextSteps: string;
  updateLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const MilestoneDoneEmail = ({
  projectName,
  milestoneName,
  nextSteps,
  updateLink,
}: MilestoneDoneEmailProps) => {
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
            <Text style={styles.h1}>Milestone Completed: {milestoneName}</Text>
            
            <Text style={styles.text}>
              Great news! The <span style={styles.bold}>{milestoneName}</span> milestone has been marked as complete.
            </Text>
            
            <Section style={{ margin: '24px 0', padding: '16px', backgroundColor: '#F8F9FB', borderRadius: '4px' }}>
              <Text style={{ margin: 0, color: '#0F2C4C', fontWeight: 'bold', marginBottom: '8px' }}>What happens next?</Text>
              <Text style={{ margin: 0, color: '#5B6B7C', fontSize: '14px' }}>{nextSteps}</Text>
            </Section>

            <Text style={styles.text}>
              Please review the milestone deliverables. You can approve it or request changes directly in the portal.
            </Text>

            <Section style={styles.buttonContainer}>
              <Button href={updateLink} style={styles.button}>
                Review & Approve Milestone
              </Button>
            </Section>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Manage your notifications at <Link href={`${baseUrl}/portal/settings`} style={styles.footerLink}>Portal Settings</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default MilestoneDoneEmail;
