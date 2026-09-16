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

interface WelcomeEmailProps {
  email: string;
  tempPassword?: string;
  portalLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const WelcomeEmail = ({
  email,
  tempPassword,
  portalLink = `${baseUrl}/portal/login`,
}: WelcomeEmailProps) => {
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
            <Text style={styles.h1}>Welcome to the HexaLogic Portal</Text>
            
            <Text style={styles.text}>
              Your account has been created. You can log in using the email address <span style={styles.bold}>{email}</span> and the temporary password below:
            </Text>
            
            {tempPassword && (
              <Text style={styles.code}>
                {tempPassword}
              </Text>
            )}

            <Text style={styles.text}>
              You will be required to change your password upon your first login.
            </Text>

            <Section style={styles.buttonContainer}>
              <Button href={portalLink} style={styles.button}>
                Log In to Portal
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

export default WelcomeEmail;
