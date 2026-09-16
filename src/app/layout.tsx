import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "HexaLogic Tech Solutions — Smart Digital Solutions for Modern Businesses",
  description:
    "HexaLogic Tech Solutions provides premium web development, custom software, business automation, cloud solutions, and IT consulting for modern businesses.",
  keywords: [
    "web development",
    "software solutions",
    "business automation",
    "cloud solutions",
    "IT consulting",
    "HexaLogic",
  ],
  openGraph: {
    title: "HexaLogic Tech Solutions",
    description:
      "Building smart solutions for modern businesses. Web development, custom software, automation & more.",
    type: "website",
  },
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
      <body>{children}</body>
    </html>
  );
}
