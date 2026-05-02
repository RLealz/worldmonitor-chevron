import { SITE_VARIANT } from './variant';

export interface DemoAccessPolicy {
  suppressUserAccountUx: boolean;
  suppressCommerceUx: boolean;
  ungateDemoDashboardUx: boolean;
}

const STANDALONE_DEMO_VARIANTS = new Set(['scm', 'chevron-scm']);

export function isStandaloneScmDemo(variant: string = SITE_VARIANT): boolean {
  return STANDALONE_DEMO_VARIANTS.has(variant);
}

export function getDemoAccessPolicy(variant: string = SITE_VARIANT): DemoAccessPolicy {
  const standalone = isStandaloneScmDemo(variant);
  return {
    suppressUserAccountUx: standalone,
    suppressCommerceUx: standalone,
    ungateDemoDashboardUx: standalone,
  };
}

export const DEMO_ACCESS_POLICY = getDemoAccessPolicy();
