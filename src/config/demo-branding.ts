import { SITE_VARIANT } from './variant';

const STANDALONE_DEMO_VARIANTS = new Set(['scm', 'chevron-scm']);

export interface DemoBranding {
  isStandaloneDemo: boolean;
  productName: string;
  shortName: string;
  mobileName: string;
  variantLabel: string;
  footerSubline: string;
  description: string;
  applicationName: string;
  demoLogoSrc: string;
  demoLogoAlt: string;
  partnerLogoSrc: string;
  partnerLogoAlt: string;
  suppressProductPromoSurfaces: boolean;
}

const WORLDMONITOR_BRANDING: DemoBranding = {
  isStandaloneDemo: false,
  productName: 'World Monitor',
  shortName: 'MONITOR',
  mobileName: 'World Monitor',
  variantLabel: 'World Monitor',
  footerSubline: '',
  description: 'Real-time global intelligence dashboard',
  applicationName: 'World Monitor',
  demoLogoSrc: '/favico/favicon-32x32.png',
  demoLogoAlt: 'World Monitor',
  partnerLogoSrc: '',
  partnerLogoAlt: '',
  suppressProductPromoSurfaces: false,
};

const CHEVRON_SCM_BRANDING: DemoBranding = {
  isStandaloneDemo: true,
  productName: 'Chevron SCM Demo Dashboard',
  shortName: 'Chevron SCM',
  mobileName: 'Chevron SCM',
  variantLabel: 'Chevron SCM',
  footerSubline: 'Public-data demo - no proprietary Chevron operational data',
  description: 'Public-data supply chain intelligence demo for energy suppliers, routes, sanctions, trade controls, and materials risk.',
  applicationName: 'Chevron SCM Demo',
  demoLogoSrc: '/branding/chevron-scm-demo-logo.svg',
  demoLogoAlt: 'Chevron SCM demo dashboard logo',
  partnerLogoSrc: '/branding/chevron-logo.svg',
  partnerLogoAlt: 'Chevron logo',
  suppressProductPromoSurfaces: true,
};

export function getDemoBranding(variant = SITE_VARIANT): DemoBranding {
  return STANDALONE_DEMO_VARIANTS.has(variant) ? CHEVRON_SCM_BRANDING : WORLDMONITOR_BRANDING;
}

export const DEMO_BRANDING = getDemoBranding();

function setMeta(selector: string, value: string): void {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = value;
}

function removeMeta(selector: string): void {
  document.querySelector(selector)?.remove();
}

export function applyDemoBrandingMetadata(branding: DemoBranding = DEMO_BRANDING): void {
  if (typeof document === 'undefined' || !branding.isStandaloneDemo) return;

  document.title = `${branding.productName} - Public-Data SCM Intelligence`;
  document.documentElement.dataset.productBrand = 'chevron-scm-demo';

  setMeta('meta[name="title"]', `${branding.productName} - Public-Data SCM Intelligence`);
  setMeta('meta[name="description"]', branding.description);
  setMeta('meta[name="application-name"]', branding.applicationName);
  setMeta('meta[name="subject"]', 'Public-data supply chain intelligence demo');
  setMeta('meta[name="classification"]', 'Public Data SCM Demo Dashboard');
  setMeta('meta[property="og:title"]', `${branding.productName} - Public-Data SCM Intelligence`);
  setMeta('meta[property="og:description"]', branding.description);
  setMeta('meta[property="og:site_name"]', branding.applicationName);
  setMeta('meta[property="og:image:alt"]', `${branding.productName} dashboard shell`);
  setMeta('meta[name="twitter:title"]', `${branding.productName} - Public-Data SCM Intelligence`);
  setMeta('meta[name="twitter:description"]', branding.description);

  removeMeta('meta[name="author"]');
  removeMeta('meta[name="twitter:creator"]');
}
