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

interface NewUpdateEmailProps {
  projectName: string;
  updateTitle: string;
  updateBody: string;
  progressPercent: number;
  thumbnailUrl?: string;
  updateLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const NewUpdateEmail = ({
  projectName,
  updateTitle,
  updateBody,
  progressPercent,
  thumbnailUrl,
  updateLink,
}: NewUpdateEmailProps) => {
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
            <Text style={styles.h1}>{updateTitle}</Text>
            
            {thumbnailUrl && (
              <Img src={thumbnailUrl} width="100%" alt="Update thumbnail" style={{ borderRadius: '4px', marginBottom: '24px' }} />
            )}

            <Text style={styles.text}>{updateBody}</Text>
            
            {/* Table-based Progress Bar */}
            <Section style={{ margin: '24px 0' }}>
              <Text style={{ ...styles.bold, fontSize: '14px', marginBottom: '8px' }}>Project Progress: {progressPercent}%</Text>
              <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={{ backgroundColor: '#F8F9FB', borderRadius: '4px', width: '100%' }}>
                <tr>
                  <td width={`${progressPercent}%`} style={{ backgroundColor: '#1BB8A3', height: '8px', borderRadius: '4px' }}></td>
                  <td width={`${100 - progressPercent}%`} style={{ height: '8px' }}></td>
                </tr>
              </table>
            </Section>

            <Section style={styles.buttonContainer}>
              <Button href={updateLink} style={styles.button}>
                View Update in Portal
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

export default NewUpdateEmail;
