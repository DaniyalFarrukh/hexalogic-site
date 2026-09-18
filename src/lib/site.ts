// Central site configuration. Keep the canonical domain in one place so
// metadata, sitemaps, emails and auth redirects never drift apart.
const FALLBACK_SITE_URL = 'https://www.hexalogictechandsolutions.com'

function normalize(url: string) {
  return url.replace(/\/+$/, '')
}

export const SITE_URL = normalize(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL)

export const SITE_NAME = 'HexaLogic Tech Solutions'

export const SITE_DESCRIPTION =
  'HexaLogic Tech Solutions provides premium web development, custom software, business automation, cloud solutions, and IT consulting for modern businesses.'

export const CONTACT_EMAIL = 'hexalogict@gmail.com'
export const CONTACT_PHONE_DISPLAY = '+92 3377079748'
export const CONTACT_PHONE_TEL = '+923377079748'
export const CONTACT_LOCATION = 'Lahore, Pakistan'

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/hexaloigc-and-tech/',
  github: 'https://github.com/DaniyalFarrukh',
}

/** Marketing pages that belong in the sitemap, with a relative priority. */
export const PUBLIC_ROUTES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/services/web-development', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/custom-software', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/ui-ux-design', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/business-automation', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/cloud-solutions', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/services/it-consulting', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/case-studies', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/case-studies/decornish', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/case-studies/mystique-tech', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/case-studies/scorlyn', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/case-studies/estateiq-ai', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
]
