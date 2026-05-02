import type { MapLayers } from '@/types';

export const CHEVRON_DEMO_VIEW_STORAGE_KEY = 'chevron-demo-view';

export type ChevronDemoViewId = 'scm' | 'energy' | 'materials' | 'trade' | 'routes' | 'markets';

export interface ChevronDemoView {
  id: ChevronDemoViewId;
  label: string;
  shortLabel: string;
  description: string;
  sourceVariant: 'scm' | 'energy' | 'commodity' | 'finance' | 'full';
  safetyCopy: string;
  panelKeys: string[];
  mapLayers: MapLayers;
  mobileMapLayers: MapLayers;
}

const baseLayers = (enabled: Partial<MapLayers> = {}): MapLayers => ({
  conflicts: false,
  bases: false,
  cables: false,
  pipelines: false,
  hotspots: false,
  ais: false,
  nuclear: false,
  irradiators: false,
  sanctions: false,
  weather: false,
  economic: false,
  waterways: false,
  outages: false,
  cyberThreats: false,
  datacenters: false,
  protests: false,
  flights: false,
  military: false,
  natural: false,
  spaceports: false,
  minerals: false,
  fires: false,
  ucdpEvents: false,
  displacement: false,
  climate: false,
  startupHubs: false,
  cloudRegions: false,
  accelerators: false,
  techHQs: false,
  techEvents: false,
  stockExchanges: false,
  financialCenters: false,
  centralBanks: false,
  commodityHubs: false,
  gulfInvestments: false,
  positiveEvents: false,
  kindness: false,
  happiness: false,
  speciesRecovery: false,
  renewableInstallations: false,
  tradeRoutes: false,
  iranAttacks: false,
  gpsJamming: false,
  satellites: false,
  ciiChoropleth: false,
  resilienceScore: false,
  dayNight: false,
  miningSites: false,
  processingPlants: false,
  commodityPorts: false,
  webcams: false,
  diseaseOutbreaks: false,
  radiationWatch: false,
  storageFacilities: false,
  fuelShortages: false,
  liveTankers: false,
  ...enabled,
});

const PUBLIC_DEMO_SAFETY_COPY =
  'Public-data Chevron demo view. Uses open-source signals only and does not represent Chevron endorsement or access to Chevron proprietary suppliers, contracts, shipments, inventory, pricing, routes, or operational systems.';

export const CHEVRON_DEMO_VIEWS: ChevronDemoView[] = [
  {
    id: 'scm',
    label: 'Chevron SCM',
    shortLabel: 'SCM',
    description: 'Supply-chain monitoring view for public energy, chokepoint, sanctions, and logistics signals.',
    sourceVariant: 'scm',
    safetyCopy: PUBLIC_DEMO_SAFETY_COPY,
    panelKeys: [
      'map',
      'energy-risk-overview',
      'supplier-risk',
      'chokepoint-strip',
      'supply-chain',
      'trade-policy',
      'sanctions-pressure',
      'pipeline-status',
      'storage-facility-map',
      'fuel-shortages',
      'energy-disruptions',
      'live-news',
      'energy-complex',
      'oil-inventories',
      'hormuz-tracker',
      'commodities',
      'fuel-prices',
      'macro-signals',
      'monitors',
    ],
    mapLayers: baseLayers({
      pipelines: true,
      ais: true,
      sanctions: true,
      weather: true,
      waterways: true,
      outages: true,
      natural: true,
      minerals: true,
      fires: true,
      commodityHubs: true,
      tradeRoutes: true,
      commodityPorts: true,
      storageFacilities: true,
      fuelShortages: true,
      liveTankers: true,
    }),
    mobileMapLayers: baseLayers({
      pipelines: true,
      sanctions: true,
      waterways: true,
      outages: true,
      natural: true,
      commodityPorts: true,
      storageFacilities: true,
      fuelShortages: true,
    }),
  },
  {
    id: 'energy',
    label: 'Energy',
    shortLabel: 'Energy',
    description: 'Public energy infrastructure, disruption, inventories, and market-risk signals.',
    sourceVariant: 'energy',
    safetyCopy: PUBLIC_DEMO_SAFETY_COPY,
    panelKeys: [
      'map',
      'live-news',
      'energy-risk-overview',
      'pipeline-status',
      'storage-facility-map',
      'fuel-shortages',
      'energy-disruptions',
      'energy-complex',
      'oil-inventories',
      'hormuz-tracker',
      'supply-chain',
      'sanctions-pressure',
      'commodities',
      'fuel-prices',
      'macro-signals',
      'climate',
      'monitors',
    ],
    mapLayers: baseLayers({
      pipelines: true,
      ais: true,
      sanctions: true,
      weather: true,
      waterways: true,
      outages: true,
      natural: true,
      minerals: true,
      fires: true,
      climate: true,
      commodityHubs: true,
      tradeRoutes: true,
      commodityPorts: true,
      storageFacilities: true,
      fuelShortages: true,
      liveTankers: true,
    }),
    mobileMapLayers: baseLayers({
      pipelines: true,
      waterways: true,
      natural: true,
      commodityPorts: true,
      storageFacilities: true,
      fuelShortages: true,
    }),
  },
  {
    id: 'materials',
    label: 'Materials/Commodities',
    shortLabel: 'Materials',
    description: 'Public commodity, metals, mining, and regulation context for supply-chain exposure analysis.',
    sourceVariant: 'commodity',
    safetyCopy: PUBLIC_DEMO_SAFETY_COPY,
    panelKeys: [
      'map',
      'live-news',
      'commodities',
      'energy-complex',
      'supply-chain',
      'sanctions-pressure',
      'macro-signals',
      'commodity-news',
      'mining-news',
      'critical-minerals',
      'base-metals',
      'mining-companies',
      'commodity-regulation',
      'satellite-fires',
      'monitors',
    ],
    mapLayers: baseLayers({
      weather: true,
      natural: true,
      minerals: true,
      fires: true,
      climate: true,
      commodityHubs: true,
      tradeRoutes: true,
      miningSites: true,
      processingPlants: true,
      commodityPorts: true,
    }),
    mobileMapLayers: baseLayers({
      natural: true,
      minerals: true,
      miningSites: true,
      processingPlants: true,
      commodityPorts: true,
    }),
  },
  {
    id: 'trade',
    label: 'Trade/Sanctions',
    shortLabel: 'Trade',
    description: 'Public trade-control, sanctions, macro, and supply-chain screening signals.',
    sourceVariant: 'full',
    safetyCopy: PUBLIC_DEMO_SAFETY_COPY,
    panelKeys: [
      'map',
      'live-news',
      'trade-policy',
      'sanctions-pressure',
      'supply-chain',
      'supplier-risk',
      'macro-signals',
      'commodities',
      'energy-complex',
      'gulf-economies',
      'monitors',
    ],
    mapLayers: baseLayers({
      ais: true,
      sanctions: true,
      economic: true,
      waterways: true,
      outages: true,
      natural: true,
      commodityHubs: true,
      tradeRoutes: true,
      commodityPorts: true,
      liveTankers: true,
    }),
    mobileMapLayers: baseLayers({
      sanctions: true,
      waterways: true,
      natural: true,
      tradeRoutes: true,
      commodityPorts: true,
    }),
  },
  {
    id: 'routes',
    label: 'Routes/Maritime',
    shortLabel: 'Routes',
    description: 'Public maritime chokepoint, tanker, port, route, and disruption context.',
    sourceVariant: 'scm',
    safetyCopy: PUBLIC_DEMO_SAFETY_COPY,
    panelKeys: [
      'map',
      'live-news',
      'supply-chain',
      'chokepoint-strip',
      'hormuz-tracker',
      'pipeline-status',
      'storage-facility-map',
      'fuel-shortages',
      'energy-disruptions',
      'commodities',
      'oil-inventories',
      'monitors',
    ],
    mapLayers: baseLayers({
      pipelines: true,
      ais: true,
      weather: true,
      waterways: true,
      outages: true,
      natural: true,
      tradeRoutes: true,
      commodityPorts: true,
      storageFacilities: true,
      fuelShortages: true,
      liveTankers: true,
    }),
    mobileMapLayers: baseLayers({
      pipelines: true,
      waterways: true,
      natural: true,
      tradeRoutes: true,
      commodityPorts: true,
      storageFacilities: true,
      fuelShortages: true,
    }),
  },
  {
    id: 'markets',
    label: 'Finance/Markets',
    shortLabel: 'Markets',
    description: 'Public market, macro, energy, commodity, currency, and rates context.',
    sourceVariant: 'finance',
    safetyCopy: PUBLIC_DEMO_SAFETY_COPY,
    panelKeys: [
      'map',
      'live-news',
      'markets',
      'commodities',
      'energy-complex',
      'macro-signals',
      'heatmap',
      'finance',
      'economic',
      'forex',
      'bonds',
      'centralbanks',
      'fuel-prices',
      'oil-inventories',
      'monitors',
    ],
    mapLayers: baseLayers({
      weather: true,
      economic: true,
      natural: true,
      stockExchanges: true,
      financialCenters: true,
      centralBanks: true,
      commodityHubs: true,
      tradeRoutes: true,
      commodityPorts: true,
    }),
    mobileMapLayers: baseLayers({
      economic: true,
      natural: true,
      stockExchanges: true,
      financialCenters: true,
      centralBanks: true,
      commodityHubs: true,
    }),
  },
];

const CHEVRON_DEMO_VIEW_IDS = new Set<ChevronDemoViewId>(CHEVRON_DEMO_VIEWS.map(view => view.id));

export function isChevronDemoViewId(value: string | null | undefined): value is ChevronDemoViewId {
  return !!value && CHEVRON_DEMO_VIEW_IDS.has(value as ChevronDemoViewId);
}

export function getChevronDemoView(value: string | null | undefined): ChevronDemoView {
  return CHEVRON_DEMO_VIEWS.find(view => view.id === value) ?? CHEVRON_DEMO_VIEWS[0]!;
}

export function getInitialChevronDemoView(): ChevronDemoView {
  if (typeof window === 'undefined') return CHEVRON_DEMO_VIEWS[0]!;

  const params = new URLSearchParams(window.location.search);
  const urlView = params.get('demoView') ?? params.get('view');
  if (isChevronDemoViewId(urlView)) return getChevronDemoView(urlView);

  try {
    const storedView = window.localStorage.getItem(CHEVRON_DEMO_VIEW_STORAGE_KEY);
    if (isChevronDemoViewId(storedView)) return getChevronDemoView(storedView);
  } catch {
    // Ignore blocked storage and fall back to SCM.
  }

  return CHEVRON_DEMO_VIEWS[0]!;
}

export function persistChevronDemoView(viewId: ChevronDemoViewId): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CHEVRON_DEMO_VIEW_STORAGE_KEY, viewId);
  } catch {
    // Ignore blocked storage; navigation still falls back to the URL/default view.
  }
}
