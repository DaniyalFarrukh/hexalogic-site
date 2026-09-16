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

interface ProjectCompleteEmailProps {
  projectName: string;
  totalHours: number;
  startDate: string;
  endDate: string;
  updateLink: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const ProjectCompleteEmail = ({
  projectName,
  totalHours,
  startDate,
  endDate,
  updateLink,
}: ProjectCompleteEmailProps) => {
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
            <Text style={styles.h1}>Project Completed! 🎉</Text>
            
            <Text style={styles.text}>
              We are thrilled to announce that your project has been successfully completed. Below is a quick summary of the work:
            </Text>
            
            <Section style={{ margin: '24px 0', padding: '16px', backgroundColor: '#F8F9FB', borderRadius: '4px' }}>
              <table width="100%" cellPadding="8" cellSpacing="0" border={0}>
                <tr>
                  <td width="50%">
                    <Text style={{ margin: 0, color: '#5B6B7C', fontSize: '14px' }}>Time Logged</Text>
                    <Text style={{ margin: 0, color: '#0F2C4C', fontSize: '18px', fontWeight: 'bold' }}>{totalHours} hrs</Text>
                  </td>
                  <td width="50%">
                    <Text style={{ margin: 0, color: '#5B6B7C', fontSize: '14px' }}>Duration</Text>
                    <Text style={{ margin: 0, color: '#0F2C4C', fontSize: '16px', fontWeight: 'bold' }}>{startDate} - {endDate}</Text>
                  </td>
                </tr>
              </table>
            </Section>

            <Text style={styles.text}>
              Please review the final deliverables and let us know your thoughts!
            </Text>

            <Section style={styles.buttonContainer}>
              <Button href={updateLink} style={styles.button}>
                View Final Details & Leave a Rating
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

export default ProjectCompleteEmail;
