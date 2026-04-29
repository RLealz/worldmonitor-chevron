import { toApiUrl } from '@/services/runtime';
import { SITE_VARIANT } from '@/config/variant';

export interface HormuzSeries {
  date: string;
  value: number;
}

export interface HormuzChart {
  label: string;
  title: string;
  series: HormuzSeries[];
}

export interface HormuzTrackerData {
  fetchedAt: number;
  updatedDate: string | null;
  title: string | null;
  summary: string | null;
  paragraphs: string[];
  status: 'closed' | 'disrupted' | 'restricted' | 'open';
  charts: HormuzChart[];
  attribution: { source: string; url: string };
}

export async function fetchHormuzTracker(): Promise<HormuzTrackerData | null> {
  try {
    const resp = await fetch(toApiUrl('/api/supply-chain/hormuz-tracker'), {
      signal: AbortSignal.timeout(15_000),
    });
    if (!resp.ok) return SITE_VARIANT === 'scm' ? scmDemoHormuzTracker() : null;
    const raw = (await resp.json()) as HormuzTrackerData;
    return raw.attribution ? raw : SITE_VARIANT === 'scm' ? scmDemoHormuzTracker() : null;
  } catch {
    return SITE_VARIANT === 'scm' ? scmDemoHormuzTracker() : null;
  }
}

function scmDemoHormuzTracker(): HormuzTrackerData {
  const now = new Date();
  const series = Array.from({ length: 7 }, (_, index) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - index));
    return {
      date: d.toISOString().slice(0, 10),
      value: Math.round((58 + Math.sin(index / 1.7) * 4 + index * 0.7) * 10) / 10,
    };
  });
  return {
    fetchedAt: Date.now(),
    updatedDate: now.toISOString().slice(0, 10),
    title: 'Public demo Hormuz watch',
    summary: 'Open with elevated monitoring. This is public demo context for route-risk discussion, not an operational shipment signal.',
    paragraphs: [
      'Public demo corridor context keeps the Gulf energy route visible when live upstream data is unavailable.',
      'Use this as a scenario prompt alongside chokepoint, storage, fuel shortage, and market context panels.',
    ],
    status: 'restricted',
    charts: [
      { label: 'transits', title: 'Demo daily transit proxy', series },
    ],
    attribution: {
      source: 'WorldMonitor public SCM demo context',
      url: '/docs/scm-demo-safety.md',
    },
  };
}
