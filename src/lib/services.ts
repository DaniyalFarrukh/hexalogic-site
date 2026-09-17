export type Service = {
  slug: string
  title: string
  shortDescription: string
  tagline: string
  description: string
  image: string
  features: string[]
  deliverables: string[]
  process: { title: string; description: string }[]
}

export const SERVICES: Service[] = [
  {
    slug: 'web-development',
    title: 'Web Development',
    shortDescription: 'Modern, scalable and responsive websites.',
    tagline: 'High-performance websites and web applications',
    description:
      'We design and build fast, accessible websites and web apps with modern frameworks such as Next.js and React. From marketing sites to complex customer-facing platforms, every build is engineered for speed, search visibility and easy maintenance.',
    image: '/images/services/webdev.png',
    features: [
      'Server-side rendering for SEO and fast first loads',
      'Component-driven architecture that scales with your team',
      'Responsive, mobile-first layouts tested on real devices',
      'Analytics, forms and integrations wired in from day one',
    ],
    deliverables: ['Design system and page templates', 'Production deployment on Vercel or your cloud', 'Performance and accessibility audit', 'Documentation and handover'],
    process: [
      { title: 'Discovery', description: 'We map goals, audiences and content so the site has a clear purpose.' },
      { title: 'Design', description: 'Wireframes and high-fidelity screens, iterated with you until they feel right.' },
      { title: 'Build', description: 'Clean, tested code with continuous previews so you see progress as it happens.' },
      { title: 'Launch and support', description: 'Go-live checklist, monitoring and ongoing improvements.' },
    ],
  },
  {
    slug: 'custom-software',
    title: 'Custom Software',
    shortDescription: 'Tailored software solutions for your needs.',
    tagline: 'Bespoke systems built around how you work',
    description:
      'Off-the-shelf tools rarely fit a growing business perfectly. We build custom platforms, internal tools and client portals that integrate with your existing systems and remove the manual work slowing your team down.',
    image: '/images/services/software.png',
    features: [
      'End-to-end bespoke development from brief to launch',
      'Integration with legacy systems, CRMs and payment providers',
      'Secure APIs and role-based access control',
      'Scalable cloud infrastructure with automated deployments',
    ],
    deliverables: ['Technical specification and architecture', 'Working software delivered in milestones', 'Admin dashboards and reporting', 'Source code and full ownership'],
    process: [
      { title: 'Requirements', description: 'Workshops to capture workflows, edge cases and priorities.' },
      { title: 'Architecture', description: 'Data model, integrations and security designed before code is written.' },
      { title: 'Iterative delivery', description: 'Working features every sprint, reviewed in the client portal.' },
      { title: 'Rollout', description: 'Training, migration and a support window after launch.' },
    ],
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    shortDescription: 'Beautiful designs that users love.',
    tagline: 'Interfaces that are clear, fast and a pleasure to use',
    description:
      'Good design is more than looks. We research how your customers actually use your product, then craft flows, layouts and visual systems that reduce friction and make every interaction feel effortless.',
    image: '/images/services/uiux.png',
    features: [
      'User research, personas and journey mapping',
      'Wireframes and interactive prototypes',
      'Design systems with reusable components',
      'Accessibility and usability testing',
    ],
    deliverables: ['Figma files and component library', 'Clickable prototype for stakeholder review', 'Brand-aligned visual language', 'Developer-ready specifications'],
    process: [
      { title: 'Research', description: 'Interviews and analytics reveal what users need and where they struggle.' },
      { title: 'Structure', description: 'Information architecture and low-fidelity flows.' },
      { title: 'Visual design', description: 'Polished screens, states and motion.' },
      { title: 'Validate', description: 'Usability sessions and refinements before build.' },
    ],
  },
  {
    slug: 'cloud-solutions',
    title: 'Cloud Solutions',
    shortDescription: 'Secure, scalable and reliable cloud services.',
    tagline: 'Infrastructure that scales with your business',
    description:
      'We migrate, build and manage cloud environments on AWS, Azure and Google Cloud. Infrastructure as code, automated pipelines and monitoring keep your systems reliable while keeping costs under control.',
    image: '/images/services/cloud.png',
    features: [
      'Cloud migration with minimal downtime',
      'Infrastructure as Code with Terraform',
      'CI/CD pipelines and automated environments',
      '24/7 monitoring, alerting and backups',
    ],
    deliverables: ['Cloud architecture and cost estimate', 'Provisioned environments with IaC', 'Deployment pipelines', 'Runbooks and monitoring dashboards'],
    process: [
      { title: 'Assessment', description: 'Audit of current systems, risks and cost drivers.' },
      { title: 'Design', description: 'Target architecture, security model and migration plan.' },
      { title: 'Migration', description: 'Staged cut-over with rollback plans for each service.' },
      { title: 'Operate', description: 'Monitoring, optimisation and regular reviews.' },
    ],
  },
  {
    slug: 'it-consulting',
    title: 'IT Consulting',
    shortDescription: 'Expert guidance for your IT strategy.',
    tagline: 'Strategic technology advice you can act on',
    description:
      'Whether you are choosing a stack, planning a digital transformation or untangling technical debt, we give practical, vendor-neutral advice grounded in years of building and running software.',
    image: '/images/services/consulting.png',
    features: [
      'Digital transformation strategy and roadmaps',
      'Technology stack and architecture audits',
      'Security and compliance reviews',
      'Agile delivery coaching for in-house teams',
    ],
    deliverables: ['Written assessment with prioritised recommendations', 'Roadmap with phases and budgets', 'Vendor and tooling comparisons', 'Follow-up review sessions'],
    process: [
      { title: 'Listen', description: 'Stakeholder interviews and a review of current systems.' },
      { title: 'Analyse', description: 'Findings, risks and opportunities, clearly explained.' },
      { title: 'Recommend', description: 'A roadmap you can execute with us or on your own.' },
      { title: 'Support', description: 'Ongoing advisory as the plan is delivered.' },
    ],
  },
  {
    slug: 'business-automation',
    title: 'Business Automation',
    shortDescription: 'Automate processes and boost efficiency.',
    tagline: 'Let software handle the repetitive work',
    description:
      'We identify the manual, error-prone steps in your operations and replace them with reliable automations: workflow orchestration, integrations between your tools, and AI-assisted decision logic where it genuinely helps.',
    image: '/images/services/automation.png',
    features: [
      'Workflow orchestration across your existing tools',
      'Robotic process automation for repetitive tasks',
      'AI-powered classification and routing',
      'Real-time dashboards and exception alerts',
    ],
    deliverables: ['Process map with automation candidates', 'Implemented automations with monitoring', 'Integration with email, CRM and finance tools', 'Training for your operations team'],
    process: [
      { title: 'Process mapping', description: 'We document how work flows today and where time is lost.' },
      { title: 'Prioritise', description: 'Quick wins first, then the bigger structural automations.' },
      { title: 'Implement', description: 'Build, test and roll out with safeguards and audit trails.' },
      { title: 'Measure', description: 'Track hours saved and error rates, then iterate.' },
    ],
  },
]

export function getService(slug: string) {
  return SERVICES.find(s => s.slug === slug)
}
