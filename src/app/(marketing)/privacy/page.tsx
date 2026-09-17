import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How HexaLogic Tech Solutions collects, uses and protects your personal data.",
  alternates: { canonical: "/privacy" },
};

// Update this date whenever the policy text changes.
const LAST_UPDATED = "September 17, 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface-darkest text-white pt-28 sm:pt-32 pb-24 px-6 md:px-12 selection:bg-brand-primary selection:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Privacy <span className="text-brand-primary">Policy</span></h1>
        <p className="text-gray-400 mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-12 text-gray-300 leading-relaxed font-medium">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to HexaLogic Tech Solutions. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we look after your personal data when you visit our website or use our client portal, and tells you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Data We Collect</h2>
            <p className="mb-4">
              We may collect, use, store and transfer different kinds of personal data about you, grouped as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong className="text-gray-300">Contact Data</strong> includes billing address, email address and telephone numbers.</li>
              <li><strong className="text-gray-300">Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
              <li><strong className="text-gray-300">Usage Data</strong> includes information about how you use our website, products and services.</li>
              <li><strong className="text-gray-300">Project Data</strong> includes files, messages, comments and credentials you choose to share with us through the client portal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Data</h2>
            <p className="mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
              <li>To send you project notifications you have opted into. You can change these preferences at any time in the portal settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p className="mb-4">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. Access to your personal data is limited to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
            <p className="mb-4">
              You may request access to, correction of, or deletion of the personal data we hold about you. To exercise these rights, contact us using the details below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this privacy policy or our privacy practices, email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-primary hover:underline">{CONTACT_EMAIL}</a> or use our{" "}
              <Link href="/contact" className="text-brand-primary hover:underline">contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
