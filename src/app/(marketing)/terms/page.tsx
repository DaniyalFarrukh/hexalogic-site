import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of the HexaLogic Tech Solutions website and client portal.",
  alternates: { canonical: "/terms" },
};

// Update this date whenever the terms text changes.
const LAST_UPDATED = "September 17, 2026";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-surface-darkest text-white pt-28 sm:pt-32 pb-24 px-6 md:px-12 selection:bg-brand-primary selection:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Terms of <span className="text-brand-primary">Service</span></h1>
        <p className="text-gray-400 mb-12">Last updated: {LAST_UPDATED}</p>

        <div className="space-y-12 text-gray-300 leading-relaxed font-medium">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing our website and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on the HexaLogic Tech Solutions website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>Attempt to decompile or reverse engineer any software contained on our website;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Client Portal</h2>
            <p className="mb-4">
              Access to the client portal is provided to clients with an active engagement. You are responsible for keeping your login details confidential and for all activity under your account. Content you upload must be lawful and must not infringe the rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Disclaimer</h2>
            <p className="mb-4">
              The materials on the HexaLogic Tech Solutions website are provided on an &quot;as is&quot; basis. HexaLogic Tech Solutions makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitations</h2>
            <p className="mb-4">
              In no event shall HexaLogic Tech Solutions or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if HexaLogic Tech Solutions or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Governing Law</h2>
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with the laws of Pakistan, and you irrevocably submit to the exclusive jurisdiction of the courts of Lahore for any dispute arising from them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Contact</h2>
            <p className="mb-4">
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-primary hover:underline">{CONTACT_EMAIL}</a> or through our{" "}
              <Link href="/contact" className="text-brand-primary hover:underline">contact page</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
