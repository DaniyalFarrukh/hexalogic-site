import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Smart Digital Solutions for Modern Businesses`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "web development",
    "software solutions",
    "business automation",
    "cloud solutions",
    "IT consulting",
    "HexaLogic",
  ],
  
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Building smart solutions for modern businesses. Web development, custom software, automation & more.",
    url: "/",
    images: [{ url: "/hexalogic-logo.png", width: 360, height: 96, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description:
      "Building smart solutions for modern businesses. Web development, custom software, automation & more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "HexaLogic Tech Solutions",
              "image": "https://www.hexalogictechandsolutions.com/hexalogic-logo.png",
              "url": "https://www.hexalogictechandsolutions.com",
              "telephone": "+923377079748",
              "email": "hexalogict@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lahore",
                "addressCountry": "PK"
              },
              "sameAs": [
                "https://www.linkedin.com/company/hexaloigc-and-tech/",
                "https://github.com/DaniyalFarrukh"
              ]
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
