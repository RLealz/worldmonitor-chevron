const buildVariant = (() => {
  try {
    return import.meta.env?.VITE_VARIANT || 'full';
  } catch {
    return 'full';
  }
})();

const SUPPORTED_VARIANTS = new Set([
  'full',
  'tech',
  'finance',
  'happy',
  'commodity',
  'energy',
  'scm',
]);

function isSupportedVariant(value: string | null): value is string {
  return value !== null && SUPPORTED_VARIANTS.has(value);
}

const resolvedBuildVariant = isSupportedVariant(buildVariant) ? buildVariant : 'full';

export const SITE_VARIANT: string = (() => {
  if (typeof window === 'undefined') return resolvedBuildVariant;

  const isTauri = '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
  if (isTauri) {
    const stored = localStorage.getItem('worldmonitor-variant');
    if (isSupportedVariant(stored)) return stored;
    return resolvedBuildVariant;
  }

  const h = location.hostname;
  if (h.startsWith('tech.')) return 'tech';
  if (h.startsWith('finance.')) return 'finance';
  if (h.startsWith('happy.')) return 'happy';
  if (h.startsWith('commodity.')) return 'commodity';
  if (h.startsWith('energy.')) return 'energy';
  if (h.startsWith('scm.')) return 'scm';

  if (h === 'localhost' || h === '127.0.0.1') {
    const stored = localStorage.getItem('worldmonitor-variant');
    if (isSupportedVariant(stored)) return stored;
    return resolvedBuildVariant;
  }

  return resolvedBuildVariant;
})();
