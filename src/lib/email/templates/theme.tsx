import React from 'react';
import { Tailwind } from '@react-email/components';

export const HEXALOGIC_LOGO = 'https://www.hexalogic.dev/images/hexalogo_transparent.png';
export const HEXALOGIC_URL = 'https://www.hexalogic.dev';

export const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F2C4C',
          light: '#F8F9FB',
          primary: '#1BB8A3',
          secondary: '#ff8947',
        },
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
};

export const EmailTailwind: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Tailwind config={tailwindConfig}>
      {children}
    </Tailwind>
  );
};
