import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | HexaLogic Tech Solutions",
  description:
    "HexaLogic Tech Solutions Privacy Policy, covering our website, client work, internal tools, Pinterest API integration, web platforms, and mobile apps.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "November 3, 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface-darkest text-white pt-28 sm:pt-32 pb-24 px-6 md:px-12 selection:bg-brand-primary selection:text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Privacy <span className="text-brand-primary">Policy</span>
          </h1>
          <p className="text-gray-400 text-sm mb-6">Last updated: {LAST_UPDATED}</p>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed font-normal">
            At HexaLogic Tech Solutions, we build software, websites, mobile apps, and internal automation tools. We believe privacy should be straightforward, honest, and transparent. This policy explains how we handle data across our website, our client projects, our internal tools (including our Pinterest API integration), and our mobile applications.
          </p>
        </div>

        {/* Quick Links Navigation */}
        <nav aria-label="Quick links" className="flex flex-wrap gap-2 pt-2 pb-10 border-b border-white/10 text-sm">
          <a
            href="#general-policy"
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary text-gray-300 transition-colors border border-white/5 hover:border-brand-primary/20"
          >
            General Policy
          </a>
          <a
            href="#pinterest-integration"
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary text-gray-300 transition-colors border border-white/5 hover:border-brand-primary/20"
          >
            Pinterest Integration
          </a>
          <a
            href="#web-applications"
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary text-gray-300 transition-colors border border-white/5 hover:border-brand-primary/20"
          >
            Web Applications
          </a>
          <a
            href="#mobile-applications"
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary text-gray-300 transition-colors border border-white/5 hover:border-brand-primary/20"
          >
            Mobile Apps
          </a>
          <a
            href="#your-rights"
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-brand-primary/10 hover:text-brand-primary text-gray-300 transition-colors border border-white/5 hover:border-brand-primary/20"
          >
            Your Rights &amp; Contact
          </a>
        </nav>

        {/* Main Content Sections */}
        <div className="space-y-14 pt-10 text-gray-300 leading-relaxed font-normal">

          {/* Section 1: General Policy */}
          <section id="general-policy" className="scroll-mt-28">
            <h2 className="text-2xl font-bold text-white mb-4">1. General Website &amp; Client Privacy</h2>
            <p className="mb-4">
              When you browse our website or work with us directly, here is what we collect and why:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 mb-6">
              <li>
                <strong className="text-white">Contact &amp; Inquiries:</strong> When you reach out via our contact form, email, or schedule a call, we collect your name, email, and project details so we can reply and work together.
              </li>
              <li>
                <strong className="text-white">Client Portal Data:</strong> If you are a client with portal access, we store your account login and any files, feedback, or milestone updates you share with us.
              </li>
              <li>
                <strong className="text-white">Technical &amp; Analytics:</strong> Standard logs like IP address, browser type, and page visits to ensure the website runs fast and stays secure.
              </li>
            </ul>
            <p className="text-gray-400">
              We never sell or rent your personal information to third parties. We use standard, industry-grade security measures (including HTTPS encryption) to keep your information safe.
            </p>
          </section>

          {/* Section 2: Pinterest API Integration (Humanized & Exact Disclosures) */}
          <section
            id="pinterest-integration"
            className="scroll-mt-28 rounded-2xl bg-[#121214] border border-white/10 p-6 sm:p-8"
          >
            <div className="mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">Internal Tool Integration</span>
              <h2 className="text-2xl font-bold text-white mt-1">2. Pinterest API Integration &amp; Publishing Tool</h2>
            </div>

            <p className="mb-6 text-gray-200">
              HexaLogic Tech Solutions operates an internal tool that connects to Pinterest through Pinterest’s official API to publish pins to Pinterest accounts owned by HexaLogic Tech Solutions and its brands.
            </p>

            <div className="space-y-5 text-gray-300">
              <div className="border-t border-white/5 pt-4">
                <h3 className="text-white font-semibold mb-1">Data we access</h3>
                <p className="text-gray-400">
                  With our own authorisation, the tool reads the list of boards on our account and creates pins (image, title, description, destination link). It does not access, collect or store data about other Pinterest users.
                </p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h3 className="text-white font-semibold mb-1">How it is stored</h3>
                <p className="text-gray-400">
                  Access tokens issued by Pinterest are stored securely on our own systems, are used only to publish our content, and are never shared with third parties. We keep a record of the pins we publish, for scheduling purposes only.
                </p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h3 className="text-white font-semibold mb-1">Affiliate links</h3>
                <p className="text-gray-400">
                  Some pins link to products on Amazon. As an Amazon Associate we earn from qualifying purchases. This is disclosed on each pin.
                </p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h3 className="text-white font-semibold mb-1">Revoking access</h3>
                <p className="text-gray-400">
                  Access can be revoked at any time from Pinterest’s settings under <span className="text-white font-medium">Security → Apps</span>, after which the tool can no longer reach the account.
                </p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h3 className="text-white font-semibold mb-1">Contact</h3>
                <p className="text-gray-400">
                  Privacy questions about this integration can be sent directly to{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-primary hover:underline">
                    {CONTACT_EMAIL}
                  </a>.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Web Applications */}
          <section id="web-applications" className="scroll-mt-28">
            <h2 className="text-2xl font-bold text-white mb-4">3. Web Applications &amp; Client Projects</h2>
            <p className="mb-4">
              For web software, SaaS platforms, and client portals built or managed by HexaLogic Tech Solutions:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>
                <strong className="text-white">Minimal Data Collection:</strong> We only collect information essential for the application to function (such as user accounts, session tokens, and core application records).
              </li>
              <li>
                <strong className="text-white">Encryption &amp; Hosting:</strong> All network traffic runs over encrypted HTTPS/TLS. Sensitive keys and database records are protected with industry-standard encryption and hosted on reputable cloud platforms (such as Supabase, AWS, or Vercel).
              </li>
              <li>
                <strong className="text-white">No Selling of Data:</strong> User data is never sold, leased, or monetized for advertising.
              </li>
            </ul>
          </section>

          {/* Section 4: Mobile Applications */}
          <section id="mobile-applications" className="scroll-mt-28">
            <h2 className="text-2xl font-bold text-white mb-4">4. Mobile Applications (iOS &amp; Android)</h2>
            <p className="mb-4">
              For mobile apps created and published by HexaLogic Tech Solutions:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>
                <strong className="text-white">Device Permissions:</strong> We only request permissions (like photo library access or camera) when you explicitly perform an action requiring it, such as uploading an avatar or project file. We do not track your location in the background or access sensitive device features without consent.
              </li>
              <li>
                <strong className="text-white">Analytics &amp; Crash Reports:</strong> Any telemetry or crash logs collected are anonymized and used solely to fix bugs and improve stability.
              </li>
              <li>
                <strong className="text-white">Account &amp; Data Deletion:</strong> Any mobile app supporting account creation includes a straightforward option to delete your account and associated data directly within the app or by emailing our support team.
              </li>
            </ul>
          </section>

          {/* Section 5: Rights & Contact */}
          <section id="your-rights" className="scroll-mt-28 border-t border-white/10 pt-10">
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights &amp; How to Contact Us</h2>
            <p className="mb-4">
              You have the right to request a copy of the personal information we hold about you, request corrections, or ask us to delete it entirely.
            </p>
            <p className="mb-6">
              If you have any questions, concerns, or requests regarding this Privacy Policy or any of our projects, feel free to reach out to us directly:
            </p>

            <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 text-sm text-gray-300 space-y-2">
              <p>
                <strong className="text-white">Company:</strong> HexaLogic Tech Solutions
              </p>
              <p>
                <strong className="text-white">Email:</strong>{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-primary hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>
                <strong className="text-white">Contact Page:</strong>{" "}
                <Link href="/contact" className="text-brand-primary hover:underline">
                  hexalogictechandsolutions.com/contact
                </Link>
              </p>
              <p>
                <strong className="text-white">Location:</strong> Lahore, Pakistan
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
