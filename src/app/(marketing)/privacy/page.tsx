import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | HexaLogic Tech Solutions",
  description:
    "HexaLogic Tech Solutions Privacy Policy explains what personal data we collect when you visit hexalogictechandsolutions.com, use our client portal, work with us on a project, or interact with our integrations.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "November 3, 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink pt-28 sm:pt-32 pb-24 px-6 md:px-12 selection:bg-accent selection:text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header - Clean title with NO dash */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Privacy <span className="text-accent">Policy</span>
          </h1>
          <p className="text-ink-soft text-sm mb-6">Last updated: {LAST_UPDATED}</p>
          <p className="text-ink-soft text-base md:text-lg leading-relaxed font-normal">
            Welcome to HexaLogic Tech Solutions. We respect your privacy and are committed to protecting your personal data across our website, our client portal, our software development projects, and our internal tools and integrations.
          </p>
        </div>

        {/* Quick Jump Pills */}
        <div className="flex flex-wrap gap-2.5 mb-12 pb-6 border-b border-line-strong text-sm">
          <a
            href="#who-we-are"
            className="px-3.5 py-1.5 rounded-full bg-card hover:bg-accent/10 hover:text-accent text-ink-soft transition-colors border border-line"
          >
            Who We Are
          </a>
          <a
            href="#pinterest-integration"
            className="px-3.5 py-1.5 rounded-full bg-accent/10 hover:bg-accent/15 text-accent font-semibold transition-colors border border-accent/35"
          >
            Pinterest Integration
          </a>
          <a
            href="#data-we-collect"
            className="px-3.5 py-1.5 rounded-full bg-card hover:bg-accent/10 hover:text-accent text-ink-soft transition-colors border border-line"
          >
            Data We Collect
          </a>
          <a
            href="#client-credentials"
            className="px-3.5 py-1.5 rounded-full bg-card hover:bg-accent/10 hover:text-accent text-ink-soft transition-colors border border-line"
          >
            Credentials &amp; Security
          </a>
          <a
            href="#your-rights"
            className="px-3.5 py-1.5 rounded-full bg-card hover:bg-accent/10 hover:text-accent text-ink-soft transition-colors border border-line"
          >
            Your Rights
          </a>
          <a
            href="#contact-us"
            className="px-3.5 py-1.5 rounded-full bg-card hover:bg-accent/10 hover:text-accent text-ink-soft transition-colors border border-line"
          >
            Contact
          </a>
        </div>

        {/* Body Content */}
        <div className="space-y-12 text-ink-soft leading-relaxed font-normal">

          {/* 1. Who we are */}
          <section id="who-we-are" className="scroll-mt-28">
            <h2 className="text-2xl font-bold text-ink mb-4">1. Who we are</h2>
            <p className="mb-4">
              HexaLogic Tech Solutions (&quot;HexaLogic&quot;, &quot;we&quot;, &quot;us&quot;) is a software and technology services company based in Pakistan. We build custom software, web platforms, mobile applications, and automation tools for clients in Pakistan, the European Union, the United Kingdom, the United States, and Canada.
            </p>
            <p className="mb-4">
              This policy explains what personal data we collect when you visit <span className="text-ink font-medium">hexalogictechandsolutions.com</span>, use our client portal, or work with us on a project. It also explains how we use, share, and protect that data, and the rights you have over it.
            </p>
            <p className="text-ink-soft">
              For data covered by this policy, HexaLogic is the <strong className="text-ink">data controller</strong>. When a client provides us with data about their own customers or users as part of a project, we act as the client&apos;s <strong className="text-ink">data processor</strong> and handle that data only on the client&apos;s instructions.
            </p>
          </section>

          {/* PINTEREST API INTEGRATION (PROMINENT DEDICATED CLAUSE) */}
          <section
            id="pinterest-integration"
            className="scroll-mt-28 rounded-2xl bg-card border border-accent/35 p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">Internal Tool Integration</span>
              <h2 className="text-2xl font-bold text-ink mt-1">Pinterest API Integration &amp; Publishing</h2>
            </div>

            <p className="mb-6 text-ink">
              HexaLogic Tech Solutions operates an internal tool that connects to Pinterest through Pinterest’s official API to publish pins to Pinterest accounts owned by HexaLogic Tech Solutions and its brands.
            </p>

            <div className="space-y-5 text-ink-soft">
              <div className="border-t border-line pt-4">
                <h3 className="text-ink font-semibold mb-1">Data we access</h3>
                <p className="text-ink-soft">
                  With our own authorisation, the tool reads the list of boards on our account and creates pins (image, title, description, destination link). It does not access, collect or store data about other Pinterest users.
                </p>
              </div>

              <div className="border-t border-line pt-4">
                <h3 className="text-ink font-semibold mb-1">How it is stored</h3>
                <p className="text-ink-soft">
                  Access tokens issued by Pinterest are stored securely on our own systems, are used only to publish our content, and are never shared with third parties. We keep a record of the pins we publish, for scheduling purposes only.
                </p>
              </div>

              <div className="border-t border-line pt-4">
                <h3 className="text-ink font-semibold mb-1">Affiliate links</h3>
                <p className="text-ink-soft">
                  Some pins link to products on Amazon. As an Amazon Associate we earn from qualifying purchases. This is disclosed on each pin.
                </p>
              </div>

              <div className="border-t border-line pt-4">
                <h3 className="text-ink font-semibold mb-1">Revoking access</h3>
                <p className="text-ink-soft">
                  Access can be revoked at any time from Pinterest’s settings under <span className="text-ink font-medium">Security → Apps</span>, after which the tool can no longer reach the account.
                </p>
              </div>

              <div className="border-t border-line pt-4">
                <h3 className="text-ink font-semibold mb-1">Contact</h3>
                <p className="text-ink-soft">
                  Privacy questions about this integration can be sent to{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                    {CONTACT_EMAIL}
                  </a>.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Data we collect */}
          <section id="data-we-collect" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">2. Data we collect</h2>
            <div className="overflow-x-auto rounded-xl border border-line-strong mb-6">
              <table className="w-full text-left text-sm">
                <thead className="bg-card text-ink border-b border-line-strong">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Examples</th>
                    <th className="py-3 px-4 font-semibold">How we get it</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-white/[0.01]">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Identity data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Name, username, job title, company name</td>
                    <td className="py-3.5 px-4 text-ink-soft">You give it to us</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Contact data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Email address, phone number, billing address</td>
                    <td className="py-3.5 px-4 text-ink-soft">You give it to us</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Technical data</td>
                    <td className="py-3.5 px-4 text-ink-soft">IP address, browser type and version, device type, operating system, time zone, login timestamps</td>
                    <td className="py-3.5 px-4 text-ink-soft">Collected automatically when you use the site or portal</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Usage data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Pages viewed, features used, time on site, referring website</td>
                    <td className="py-3.5 px-4 text-ink-soft">Collected automatically, including through Google Analytics</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Project data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Files, messages, specifications, feedback and other material you share with us</td>
                    <td className="py-3.5 px-4 text-ink-soft">You give it to us through the portal, email or meetings</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Access credentials</td>
                    <td className="py-3.5 px-4 text-ink-soft">Usernames, passwords, API keys or hosting logins you share so we can work on your systems</td>
                    <td className="py-3.5 px-4 text-ink-soft">You give it to us; see Section 4</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-ink-soft text-sm">
              We do not knowingly collect special category data (such as health, religion, ethnicity or biometric data). Please do not send it to us unless a project specifically requires it and we have agreed how it will be handled.
            </p>
          </section>

          {/* 3. How and why we use your data */}
          <section id="how-we-use-data" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">3. How and why we use your data</h2>
            <p className="mb-4">
              We only use personal data when the law allows it. The table below shows each purpose and the legal basis we rely on under the EU and UK GDPR.
            </p>
            <div className="overflow-x-auto rounded-xl border border-line-strong mb-6">
              <table className="w-full text-left text-sm">
                <thead className="bg-card text-ink border-b border-line-strong">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Purpose</th>
                    <th className="py-3 px-4 font-semibold">Data used</th>
                    <th className="py-3 px-4 font-semibold">Legal basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-white/[0.01]">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Delivering projects and services you hired us for</td>
                    <td className="py-3.5 px-4 text-ink-soft">Identity, contact, project data, credentials</td>
                    <td className="py-3.5 px-4 text-ink-soft">Performance of a contract</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Running your client portal account</td>
                    <td className="py-3.5 px-4 text-ink-soft">Identity, contact, technical data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Performance of a contract</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Answering enquiries and sending quotes</td>
                    <td className="py-3.5 px-4 text-ink-soft">Identity, contact data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Steps taken at your request before a contract</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Sending invoices and keeping financial records</td>
                    <td className="py-3.5 px-4 text-ink-soft">Identity, contact data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Legal obligation</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Sending project notifications you opt into</td>
                    <td className="py-3.5 px-4 text-ink-soft">Contact data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Consent (change it anytime in portal settings)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Understanding how visitors use our website so we can improve it</td>
                    <td className="py-3.5 px-4 text-ink-soft">Technical, usage data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Consent (through our cookie banner)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Keeping our website and portal secure and preventing fraud</td>
                    <td className="py-3.5 px-4 text-ink-soft">Technical data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Legitimate interests</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Responding to legal claims or requests from authorities</td>
                    <td className="py-3.5 px-4 text-ink-soft">Any relevant data</td>
                    <td className="py-3.5 px-4 text-ink-soft">Legal obligation or legitimate interests</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-ink-soft text-sm">
              We do not use your data for automated decision-making that has legal or similarly significant effects on you. We do not send marketing emails unless you have opted in, and every marketing email includes an unsubscribe link.
            </p>
          </section>

          {/* 4. How we handle client credentials and project data */}
          <section id="client-credentials" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">4. How we handle client credentials and project data</h2>
            <p className="mb-4">
              Logins and access keys you share with us get extra protection, because they give access to your systems.
            </p>
            <ul className="list-disc pl-6 space-y-2.5 text-ink-soft mb-6">
              <li>
                <strong className="text-ink">Encrypted storage.</strong> Credentials are stored encrypted, either in a password manager or in encrypted fields in our portal. They are never kept in plain text, chat messages or shared documents.
              </li>
              <li>
                <strong className="text-ink">Need-to-know access.</strong> Only the team members working on your project can see your credentials.
              </li>
              <li>
                <strong className="text-ink">Use only for your project.</strong> We use credentials only to do the work you asked for, and never for any other purpose.
              </li>
              <li>
                <strong className="text-ink">Deletion after the project.</strong> We delete or revoke stored credentials within 30 days after the project ends. We recommend you change any passwords you shared once the work is finished.
              </li>
              <li>
                <strong className="text-ink">Safer alternatives.</strong> Where possible, please give us a separate user account or a temporary access key rather than your own login, so you can revoke it at any time.
              </li>
            </ul>
            <p className="text-ink-soft">
              Project files and messages are used only to deliver your project. We do not use them to train AI models, and we do not share them with anyone except as described in Section 6.
            </p>
          </section>

          {/* 5. Cookies and analytics */}
          <section id="cookies-analytics" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">5. Cookies and analytics</h2>
            <p className="mb-4">
              We use a small number of cookies. Essential cookies are always on. Analytics cookies are set only after you accept them in our cookie banner.
            </p>
            <div className="overflow-x-auto rounded-xl border border-line-strong mb-6">
              <table className="w-full text-left text-sm">
                <thead className="bg-card text-ink border-b border-line-strong">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Purpose</th>
                    <th className="py-3 px-4 font-semibold">Examples</th>
                    <th className="py-3 px-4 font-semibold">Can you turn it off?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-white/[0.01]">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Essential</td>
                    <td className="py-3.5 px-4 text-ink-soft">Keep you logged in to the portal, remember your cookie choice, keep the site secure</td>
                    <td className="py-3.5 px-4 text-ink-soft">Session and security cookies</td>
                    <td className="py-3.5 px-4 text-ink-soft">No; the site and portal need them to work</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Analytics</td>
                    <td className="py-3.5 px-4 text-ink-soft">Show us how visitors use the site, such as which pages are popular</td>
                    <td className="py-3.5 px-4 text-ink-soft">Google Analytics cookies (_ga, ga*)</td>
                    <td className="py-3.5 px-4 text-ink-soft">Yes; decline or withdraw consent in the cookie banner</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mb-3 text-ink-soft text-sm">
              Google Analytics collects usage and technical data, including a shortened IP address, and processes it on Google&apos;s servers. You can learn more in Google&apos;s privacy policy or opt out with the Google Analytics opt-out add-on.
            </p>
            <p className="text-ink-soft text-sm">
              We do not use advertising or cross-site tracking cookies. You can also block or delete cookies in your browser settings.
            </p>
          </section>

          {/* 6. Who we share your data with */}
          <section id="who-we-share-with" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">6. Who we share your data with</h2>
            <p className="mb-4">
              We do not sell your personal data, and we do not share it for targeted advertising.
            </p>
            <p className="mb-4">
              We share data only with these groups, and only as much as each one needs:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-ink-soft mb-6">
              <li><strong className="text-ink">Cloud hosting providers</strong>, which store our website, portal and project files.</li>
              <li><strong className="text-ink">Email service providers</strong>, which deliver our emails and notifications.</li>
              <li><strong className="text-ink">Google Analytics</strong>, which measures website usage (only if you accept analytics cookies).</li>
              <li><strong className="text-ink">Professional advisers</strong> such as accountants and lawyers, under a duty of confidentiality.</li>
              <li><strong className="text-ink">Authorities</strong>, when the law requires it, such as a court order.</li>
              <li><strong className="text-ink">A buyer or successor</strong>, if our business is sold or merged. They would have to protect your data as this policy describes.</li>
            </ul>
            <p className="text-ink-soft text-sm">
              Our service providers may only use your data to provide their service to us. We sign data processing terms with them, and they must keep it secure. You can ask us for a current list of the providers we use.
            </p>
          </section>

          {/* 7. International data transfers */}
          <section id="international-transfers" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">7. International data transfers</h2>
            <p className="mb-4">
              We are based in Pakistan, and our hosting, email and analytics providers may store data in other countries, including the United States. This means your data may be processed outside your own country.
            </p>
            <p className="text-ink-soft">
              When we transfer personal data out of the EU, UK or Canada, we protect it with recognised safeguards. These include the European Commission&apos;s Standard Contractual Clauses, the UK International Data Transfer Addendum, or providers certified under the EU-US Data Privacy Framework. You can contact us for a copy of the safeguards that apply to your data.
            </p>
          </section>

          {/* 8. How long we keep your data */}
          <section id="data-retention" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">8. How long we keep your data</h2>
            <p className="mb-4">
              We keep data only as long as we need it, then delete or anonymise it.
            </p>
            <div className="overflow-x-auto rounded-xl border border-line-strong mb-6">
              <table className="w-full text-left text-sm">
                <thead className="bg-card text-ink border-b border-line-strong">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Data</th>
                    <th className="py-3 px-4 font-semibold">How long we keep it</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-white/[0.01]">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Access credentials you share</td>
                    <td className="py-3.5 px-4 text-ink-soft">Deleted or revoked within 30 days after the project ends</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Project files and messages</td>
                    <td className="py-3.5 px-4 text-ink-soft">1 year after the project ends, so we can provide support and fixes</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Portal account data</td>
                    <td className="py-3.5 px-4 text-ink-soft">While your account is active, then 1 year after it closes</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Invoices and financial records</td>
                    <td className="py-3.5 px-4 text-ink-soft">As long as tax and accounting laws require</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Enquiries that did not become projects</td>
                    <td className="py-3.5 px-4 text-ink-soft">1 year after our last contact</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-ink">Google Analytics data</td>
                    <td className="py-3.5 px-4 text-ink-soft">14 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-ink-soft text-sm">
              You can ask us to delete your data sooner. We will do so unless the law requires us to keep it.
            </p>
          </section>

          {/* 9. How we keep your data secure */}
          <section id="data-security" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">9. How we keep your data secure</h2>
            <p className="mb-4">
              We use technical and organisational measures to protect your data from loss, misuse and unauthorised access. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-ink-soft mb-6">
              <li>HTTPS encryption for all traffic to our website and portal</li>
              <li>Encryption of stored credentials (see Section 4)</li>
              <li>Access limited to staff who need it, with strong passwords and two-factor authentication</li>
              <li>Regular software updates and backups</li>
              <li>Confidentiality duties for everyone who works with us</li>
            </ul>
            <p className="text-ink-soft text-sm">
              No system is completely secure. If a data breach is likely to put your rights at risk, we will tell you without undue delay. Where the law requires it, we will also report it to the relevant data protection authority, within 72 hours for breaches covered by the GDPR.
            </p>
          </section>

          {/* 10. Your rights */}
          <section id="your-rights" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">10. Your rights</h2>
            <p className="mb-4">
              You can make any of these requests by emailing{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline font-semibold">
                {CONTACT_EMAIL}
              </a>. We will reply within 30 days, and it is free of charge. We may ask you to confirm your identity first.
            </p>

            <div className="space-y-6 text-sm">
              <div className="bg-card border border-line rounded-2xl p-5">
                <h3 className="text-ink font-bold mb-2">Everyone can ask us to:</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-ink-soft">
                  <li>Give you a copy of the personal data we hold about you</li>
                  <li>Correct data that is wrong or incomplete</li>
                  <li>Delete your data, unless we must keep it by law</li>
                  <li>Stop sending you notifications or marketing</li>
                  <li>Withdraw any consent you gave, such as for analytics cookies</li>
                </ul>
              </div>

              <div className="bg-card border border-line rounded-2xl p-5">
                <h3 className="text-ink font-bold mb-2">EU and UK residents also have the right to:</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-ink-soft">
                  <li>Object to processing based on our legitimate interests</li>
                  <li>Restrict how we use your data while a concern is resolved</li>
                  <li>Receive your data in a portable, machine-readable format</li>
                  <li>Complain to your local data protection authority (in the UK, the Information Commissioner&apos;s Office)</li>
                </ul>
              </div>

              <div className="bg-card border border-line rounded-2xl p-5">
                <h3 className="text-ink font-bold mb-2">US residents:</h3>
                <p className="text-ink-soft leading-relaxed">
                  US residents, including in California and other states with privacy laws, can ask to know what data we collect and why, and to have it deleted or corrected. We do not sell or share personal data for targeted advertising, so there is nothing to opt out of. We will not treat you differently for using your rights.
                </p>
              </div>

              <div className="bg-card border border-line rounded-2xl p-5">
                <h3 className="text-ink font-bold mb-2">Canadian residents:</h3>
                <p className="text-ink-soft leading-relaxed">
                  Canadian residents can access and correct their data and withdraw consent under PIPEDA. You can also complain to the Office of the Privacy Commissioner of Canada.
                </p>
              </div>

              <div className="bg-card border border-line rounded-2xl p-5">
                <h3 className="text-ink font-bold mb-2">Pakistan residents:</h3>
                <p className="text-ink-soft leading-relaxed">
                  Pakistan residents can make all the requests listed above for everyone. We will handle them in line with Pakistani law.
                </p>
              </div>
            </div>
          </section>

          {/* 11. Children */}
          <section id="children" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">11. Children</h2>
            <p className="text-ink-soft">
              Our website and services are meant for businesses and adults. We do not knowingly collect data from anyone under 16. If you believe a child has given us personal data, contact us and we will delete it.
            </p>
          </section>

          {/* 12. Changes to this policy */}
          <section id="policy-changes" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">12. Changes to this policy</h2>
            <p className="text-ink-soft">
              We may update this policy when our services or the law change. The &quot;Last updated&quot; date at the top shows when it last changed. If we make important changes, we will tell active clients by email or through the portal before they take effect.
            </p>
          </section>

          {/* 13. Contact us */}
          <section id="contact-us" className="scroll-mt-28 border-t border-line-strong pt-10">
            <h2 className="text-2xl font-bold text-ink mb-4">13. Contact us</h2>
            <p className="mb-4">
              For any privacy question or request, contact:
            </p>
            <div className="bg-card border border-line rounded-2xl p-6 text-sm text-ink-soft space-y-2">
              <p><strong className="text-ink">Entity:</strong> HexaLogic Tech Solutions</p>
              <p>
                <strong className="text-ink">Email:</strong>{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>
                <strong className="text-ink">Website:</strong>{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  hexalogictechandsolutions.com/contact
                </Link>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
