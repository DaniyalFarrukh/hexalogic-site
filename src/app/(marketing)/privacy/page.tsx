import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy & Project Privacy Center | HexaLogic Tech Solutions",
  description:
    "HexaLogic Tech Solutions Privacy Policy, data protection practices, and dedicated privacy terms for internal tools, Pinterest API integration, web platforms, and mobile applications.",
  alternates: { canonical: "/privacy" },
};

// Update this date whenever the policy text changes.
const LAST_UPDATED = "November 3, 2026";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface-darkest text-white pt-28 sm:pt-32 pb-24 px-6 md:px-12 selection:bg-brand-primary selection:text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-4">
            HexaLogic Tech Solutions Legal &amp; Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Privacy <span className="text-brand-primary">Policy</span> &amp; Project Privacy Center
          </h1>
          <p className="text-gray-400 text-base max-w-3xl leading-relaxed">
            HexaLogic Tech Solutions respects your privacy and is committed to protecting your personal data across our company website, client portal, internal automation tools, mobile applications, and web services.
          </p>
          <div className="flex items-center gap-4 mt-4 text-xs sm:text-sm text-gray-500 font-mono">
            <span>Last updated: {LAST_UPDATED}</span>
            <span>•</span>
            <span>Applies to: HexaLogic Tech Solutions, its brands &amp; project integrations</span>
          </div>
        </div>

        {/* Quick Navigation Jump Links */}
        <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 mb-14 shadow-lg">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-primary" aria-hidden="true" />
            Jump Directly to a Policy Section
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <a
              href="#pinterest-integration"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-brand-primary/10 border border-white/5 hover:border-brand-primary/30 transition-all text-gray-300 hover:text-white flex items-center justify-between group"
            >
              <span className="font-medium text-brand-primary group-hover:text-white">Pinterest API Integration</span>
              <span className="text-xs text-brand-primary/80">→</span>
            </a>
            <a
              href="#web-applications"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-brand-primary/10 border border-white/5 hover:border-brand-primary/30 transition-all text-gray-300 hover:text-white flex items-center justify-between group"
            >
              <span className="font-medium">Web Applications</span>
              <span className="text-xs text-gray-500 group-hover:text-white">→</span>
            </a>
            <a
              href="#mobile-applications"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-brand-primary/10 border border-white/5 hover:border-brand-primary/30 transition-all text-gray-300 hover:text-white flex items-center justify-between group"
            >
              <span className="font-medium">Mobile Applications</span>
              <span className="text-xs text-gray-500 group-hover:text-white">→</span>
            </a>
            <a
              href="#automation-integrations"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-brand-primary/10 border border-white/5 hover:border-brand-primary/30 transition-all text-gray-300 hover:text-white flex items-center justify-between group"
            >
              <span className="font-medium">Automation &amp; APIs</span>
              <span className="text-xs text-gray-500 group-hover:text-white">→</span>
            </a>
            <a
              href="#general-privacy-policy"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-brand-primary/10 border border-white/5 hover:border-brand-primary/30 transition-all text-gray-300 hover:text-white flex items-center justify-between group"
            >
              <span className="font-medium">General Company Policy</span>
              <span className="text-xs text-gray-500 group-hover:text-white">→</span>
            </a>
            <a
              href="#contact-privacy"
              className="p-3 rounded-xl bg-white/[0.03] hover:bg-brand-primary/10 border border-white/5 hover:border-brand-primary/30 transition-all text-gray-300 hover:text-white flex items-center justify-between group"
            >
              <span className="font-medium">Contact &amp; Data Rights</span>
              <span className="text-xs text-gray-500 group-hover:text-white">→</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: PROJECT-SPECIFIC PRIVACY POLICIES */}
        {/* ========================================================================= */}
        <div className="mb-16">
          <div className="border-b border-white/10 pb-4 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Project &amp; Application Specific Policies</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Disclosures, data access scopes, and security standards for HexaLogic internal tools, client projects, and third-party API integrations.
            </p>
          </div>

          <div className="space-y-10">
            {/* 1.1 PINTEREST INTEGRATION TOOL (FEATURED / HIGH VISIBILITY) */}
            <section
              id="pinterest-integration"
              className="relative scroll-mt-28 bg-[#121214] border border-brand-primary/30 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
            >
              {/* Subtle background glow */}
              <div
                className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wide uppercase">
                        Pinterest Official API Integration
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 text-xs font-mono">
                        Internal Publishing Tool
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      Pinterest API Integration &amp; Publishing Policy
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400 font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                    Target: Pinterest Developer Review &amp; Compliance
                  </span>
                </div>

                {/* Primary Overview Statement */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-5 mb-6 text-gray-200 leading-relaxed font-medium">
                  <p>
                    <strong>HexaLogic Tech Solutions</strong> operates an internal tool that connects to Pinterest through Pinterest’s official API to publish pins to Pinterest accounts owned by HexaLogic Tech Solutions and its brands.
                  </p>
                </div>

                {/* Structured Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {/* Data We Access */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-white font-semibold mb-2">
                      <span className="w-2 h-2 rounded-full bg-brand-primary" />
                      <span>Data We Access</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      With our own authorisation, the tool reads the list of boards on our account and creates pins (image, title, description, destination link). It <strong>does not access, collect or store data about other Pinterest users</strong>.
                    </p>
                  </div>

                  {/* How It Is Stored */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-white font-semibold mb-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>How It Is Stored</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Access tokens issued by Pinterest are stored securely on our own systems, are used only to publish our content, and are <strong>never shared with third parties</strong>. We keep a record of the pins we publish, for scheduling purposes only.
                    </p>
                  </div>

                  {/* Affiliate Links & Disclosures */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-white font-semibold mb-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Affiliate Links &amp; Disclosures</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Some pins link to products on Amazon. <em>As an Amazon Associate we earn from qualifying purchases.</em> This affiliate relationship is transparently disclosed on each relevant pin in accordance with FTC guidelines and Pinterest community guidelines.
                    </p>
                  </div>

                  {/* Revoking Access */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2 text-white font-semibold mb-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Revoking Access</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Access can be revoked at any time from Pinterest’s settings under{" "}
                      <strong className="text-white">Security → Apps</strong>, after which the tool can no longer reach or publish to the account.
                    </p>
                  </div>
                </div>

                {/* Direct Contact for Integration */}
                <div className="mt-6 p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                  <span className="text-gray-300">
                    Privacy questions or verification inquiries regarding this integration:
                  </span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-2 text-brand-primary hover:text-white font-semibold underline underline-offset-4 transition-colors"
                  >
                    <span>{CONTACT_EMAIL}</span>
                    <span>✉</span>
                  </a>
                </div>
              </div>
            </section>

            {/* 1.2 WEB APPLICATIONS & CLIENT PLATFORMS */}
            <section
              id="web-applications"
              className="scroll-mt-28 bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide uppercase">
                  Web Applications
                </span>
                <span className="text-xs text-gray-500 font-mono">Custom Software &amp; SaaS</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                Web Application Projects Privacy Policy
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 font-medium">
                For custom web applications, SaaS dashboards, and web solutions designed, developed, or operated by HexaLogic Tech Solutions:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">Data We Collect</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                    <li>Account credentials, names, and contact emails necessary for authenticated access.</li>
                    <li>Application usage metrics, interaction logs, and error diagnostics to ensure system stability.</li>
                    <li>User-uploaded content or files strictly within the scope of application features.</li>
                  </ul>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">Data Storage &amp; Encryption</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                    <li>Data in transit is encrypted using modern TLS (HTTPS) protocols.</li>
                    <li>Sensitive credentials, API secrets, and tokens are encrypted at rest using industry-standard cryptography.</li>
                    <li>Databases are hosted in isolated, access-controlled cloud environments with automated backups.</li>
                  </ul>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">Third-Party Subprocessors</h4>
                  <p className="text-gray-300 leading-relaxed">
                    We partner with vetted, enterprise-grade cloud providers (such as Supabase, AWS, Cloudflare, and Vercel) for hosting and database infrastructure. We do not sell, rent, or trade user data to third parties or advertising brokers.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">Access Control &amp; Deletion</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Users and enterprise administrators can request full export or permanent deletion of their web application accounts and related project records by contacting our support team or using built-in account settings.
                  </p>
                </div>
              </div>
            </section>

            {/* 1.3 MOBILE APPLICATIONS */}
            <section
              id="mobile-applications"
              className="scroll-mt-28 bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
                  Mobile Applications
                </span>
                <span className="text-xs text-gray-500 font-mono">iOS &amp; Android Apps</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                Mobile Applications Privacy Policy
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 font-medium">
                For mobile applications released on Google Play and Apple App Store developed or operated by HexaLogic Tech Solutions:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">Device Permissions</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                    <li><strong>Camera / Photos:</strong> Requested strictly when the user chooses to take a photo or upload profile media / attachments.</li>
                    <li><strong>Push Notifications:</strong> Optional opt-in to deliver transactional updates, alerts, and system notices.</li>
                    <li><strong>Network / Storage:</strong> Used to cache offline data and communicate with secure APIs.</li>
                    <li>We never access background location, contacts, or microphones without explicit in-app request and functional necessity.</li>
                  </ul>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">Telemetry &amp; Crash Reporting</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Mobile apps may collect anonymized diagnostic logs (device model, operating system version, crash stack traces) to diagnose defects and optimize runtime performance. These diagnostics contain no personally identifiable information (PII).
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">In-App Purchases &amp; Store Compliance</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Payment information for in-app subscriptions or purchases is processed directly by Apple App Store or Google Play Store. HexaLogic never stores or accesses your raw credit card numbers or banking information.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">Account Deletion &amp; Data Erasure</h4>
                  <p className="text-gray-300 leading-relaxed">
                    In compliance with Apple App Store guidelines and Google Play user data policies, all our mobile apps featuring account creation provide an in-app button or verified web flow to permanently delete the account and associated cloud data.
                  </p>
                </div>
              </div>
            </section>

            {/* 1.4 AUTOMATION WORKFLOWS & THIRD-PARTY APIS */}
            <section
              id="automation-integrations"
              className="scroll-mt-28 bg-[#121214] border border-white/10 rounded-3xl p-6 md:p-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold tracking-wide uppercase">
                  APIs &amp; Automation
                </span>
                <span className="text-xs text-gray-500 font-mono">Internal &amp; Client Automations</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                Automation Workflows, Webhooks &amp; Third-Party APIs
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6 font-medium">
                HexaLogic develops custom automations, webhook handlers, and API bridges (e.g. social platforms, CRM systems, e-commerce sync, email notifications).
              </p>

              <div className="space-y-4 text-sm">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">1. Principle of Least Privilege</h4>
                  <p className="text-gray-300 leading-relaxed">
                    When connecting to third-party APIs (including Pinterest, Google, Meta, GitHub, or client CRMs), our systems request only the minimum scopes necessary to fulfill the operational task (such as publishing pins, sending transactional emails, or syncing catalog records).
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">2. Token Security &amp; Credentials Isolation</h4>
                  <p className="text-gray-300 leading-relaxed">
                    API tokens, OAuth refresh tokens, and webhook secrets are stored in secure environment vaults or encrypted database columns. They are never committed to public repositories, never shared with third parties, and are refreshed automatically according to provider specifications.
                  </p>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                  <h4 className="text-white font-semibold mb-2">3. Zero Third-Party User Data Harvesting</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Our automation tools strictly publish, manage, or analyze content belonging to HexaLogic Tech Solutions and its authorized client brands. We do not harvest, scrape, re-sell, or profile audience members, followers, or unrelated third-party users of connected platforms.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: GENERAL COMPANY PRIVACY POLICY */}
        {/* ========================================================================= */}
        <div id="general-privacy-policy" className="scroll-mt-28 border-t border-white/10 pt-16">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
              General Company Privacy Policy
            </h2>
            <p className="text-gray-400 text-sm">
              This overarching policy explains how HexaLogic Tech Solutions collects, uses, and safeguards information when you visit hexalogictechandsolutions.com, interact with our services, or use our client portal.
            </p>
          </div>

          <div className="space-y-10 text-gray-300 leading-relaxed font-medium">
            <section className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-3">1. Information We Collect</h3>
              <p className="mb-4">
                We may collect, use, store and transfer different kinds of personal data about you, grouped as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li><strong className="text-gray-200">Identity Data:</strong> first name, last name, title, username, or organization name.</li>
                <li><strong className="text-gray-200">Contact Data:</strong> email address, telephone numbers, billing address, and business location.</li>
                <li><strong className="text-gray-200">Technical Data:</strong> internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types, and operating system.</li>
                <li><strong className="text-gray-200">Usage Data:</strong> information regarding how you browse our website, interact with case studies, and utilize client portal tools.</li>
                <li><strong className="text-gray-200">Project &amp; Client Data:</strong> project briefs, specifications, uploaded assets, credentials, and communications shared with us through our client portal or direct consulting channels.</li>
              </ul>
            </section>

            <section className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-3">2. How We Use Your Data</h3>
              <p className="mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we process your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>To provide custom software development, IT consulting, cloud management, and business automation services under our contract with you.</li>
                <li>To authenticate and grant access to the secure HexaLogic client portal.</li>
                <li>To respond to inquiries submitted via our contact forms or email.</li>
                <li>Where it is necessary for our legitimate business interests and your fundamental privacy rights do not override those interests.</li>
                <li>To comply with legal, regulatory, or tax obligations.</li>
                <li>To publish and schedule content through authorized integrations (such as our internal Pinterest tool) strictly under our own brand ownership.</li>
              </ul>
            </section>

            <section className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-3">3. Data Security &amp; Confidentiality</h3>
              <p className="mb-4">
                We implement appropriate administrative, technical, and physical security measures to prevent personal data and client project materials from being accidentally lost, altered, disclosed, or accessed in an unauthorized manner.
              </p>
              <p className="text-gray-400">
                Access to personal data and client credentials is strictly restricted to employees, contractors, and agents with a legitimate need-to-know basis, bound by strict contractual confidentiality agreements.
              </p>
            </section>

            <section className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-3">4. Affiliate Disclosures &amp; Commercial Links</h3>
              <p className="mb-4">
                Certain projects and published media (such as pins published through our Pinterest automation tool) may contain affiliate links to third-party retailers, including Amazon.
              </p>
              <p className="text-gray-400">
                HexaLogic Tech Solutions participates in affiliate programs, including the Amazon Associates Program. As an Amazon Associate, we earn from qualifying purchases. This affiliate relationship does not increase the purchase price for users, and transparent disclosures are included on published affiliate content.
              </p>
            </section>

            <section className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-3">5. Data Retention &amp; Revocation</h3>
              <p className="mb-4">
                We retain personal and project data only as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li><strong>Third-Party Integrations:</strong> Access tokens and OAuth permissions can be revoked at any time by the account holder via the third party&apos;s security portal (e.g. Pinterest Settings → Security → Apps).</li>
                <li><strong>Client Portal Accounts:</strong> Retained for the duration of active service engagements and archived upon completion.</li>
                <li><strong>Contact Inquiries:</strong> Retained for ongoing customer support and historical reference.</li>
              </ul>
            </section>

            <section className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-3">6. Your Rights</h3>
              <p className="mb-4">
                Depending on your location, you may have rights under applicable privacy legislation (such as GDPR or local data protection acts), including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-400">
                <li>Request access to the personal data we hold about you.</li>
                <li>Request correction of incomplete or inaccurate data.</li>
                <li>Request erasure of your personal data where there is no good reason for us continuing to process it.</li>
                <li>Object to or request restriction of data processing.</li>
                <li>Request transfer of your personal data to another party (data portability).</li>
              </ul>
            </section>

            {/* CONTACT SECTION */}
            <section
              id="contact-privacy"
              className="scroll-mt-28 bg-[#121214] border border-white/10 rounded-2xl p-6 md:p-8"
            >
              <h3 className="text-xl font-bold text-white mb-3">7. Contact Us &amp; Privacy Inquiries</h3>
              <p className="mb-4 text-gray-300">
                If you have any questions about this Privacy Policy, your rights, or wish to submit an inquiry regarding our project integrations (including our Pinterest API tool, mobile apps, or web systems), please reach out to us:
              </p>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-sm text-gray-300">
                <p>
                  <strong>Entity:</strong> HexaLogic Tech Solutions
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-brand-primary hover:underline font-semibold"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <p>
                  <strong>Web Contact:</strong>{" "}
                  <Link href="/contact" className="text-brand-primary hover:underline font-semibold">
                    hexalogictechandsolutions.com/contact
                  </Link>
                </p>
                <p>
                  <strong>Headquarters:</strong> Lahore, Pakistan
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
