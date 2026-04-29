import type {
  GetChokepointStatusResponse,
  GetCriticalMineralsResponse,
  GetShippingRatesResponse,
  GetShippingStressResponse,
  ListPipelinesResponse,
  ListStorageFacilitiesResponse,
  ListFuelShortagesResponse,
  ListEnergyDisruptionsResponse,
} from '@/generated/client/worldmonitor/supply_chain/v1/service_client';
import type { ListCommodityQuotesResponse, ListCryptoQuotesResponse } from '@/generated/client/worldmonitor/market/v1/service_client';
import type {
  GetCustomsRevenueResponse,
  GetTariffTrendsResponse,
  GetTradeBarriersResponse,
  GetTradeFlowsResponse,
  GetTradeRestrictionsResponse,
  ListComtradeFlowsResponse,
} from '@/generated/client/worldmonitor/trade/v1/service_client';
import type { ListSanctionsPressureResponse } from '@/generated/client/worldmonitor/sanctions/v1/service_client';

function isoNow(): string {
  return new Date().toISOString();
}

function unixNow(): number {
  return Math.floor(Date.now() / 1000);
}

function history(base: number, points = 12): number[] {
  return Array.from({ length: points }, (_, index) => Math.round((base + Math.sin(index / 2) * base * 0.025 + index * base * 0.003) * 100) / 100);
}

function datedHistory(base: number, unitStep = 1): { date: string; value: number }[] {
  const now = new Date();
  return Array.from({ length: 10 }, (_, index) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (9 - index) * 7);
    return {
      date: d.toISOString().slice(0, 10),
      value: Math.round((base + Math.sin(index / 1.7) * unitStep + index * unitStep * 0.2) * 10) / 10,
    };
  });
}

export function scmDemoChokepointStatus(): GetChokepointStatusResponse {
  const fetchedAt = isoNow();
  return {
    fetchedAt,
    upstreamUnavailable: false,
    chokepoints: [
      {
        id: 'hormuz_strait',
        name: 'Strait of Hormuz',
        lat: 26.56,
        lon: 56.25,
        disruptionScore: 34,
        status: 'yellow',
        activeWarnings: 2,
        congestionLevel: 'elevated',
        affectedRoutes: ['Gulf energy exports', 'Asia crude routes', 'LNG tanker lanes'],
        description: 'Public demo signal: elevated monitoring for Gulf energy transit based on public chokepoint context.',
        aisDisruptions: 1,
        directions: ['E', 'W'],
        directionalDwt: [
          { direction: 'E', dwtThousandTonnes: 920, wowChangePct: -3.4 },
          { direction: 'W', dwtThousandTonnes: 780, wowChangePct: 1.2 },
        ],
        transitSummary: {
          todayTotal: 62,
          todayTanker: 41,
          todayCargo: 12,
          todayOther: 9,
          wowChangePct: -4.8,
          history: [],
          riskLevel: 'elevated',
          incidentCount7d: 2,
          disruptionPct: 6.5,
          riskSummary: 'Public demo corridor shows elevated monitoring, not an operational route claim.',
          riskReportAction: 'Review alternate feedstock timing assumptions using public scenario context.',
          dataAvailable: false,
        },
        flowEstimate: {
          currentMbd: 18.7,
          baselineMbd: 20.5,
          flowRatio: 0.91,
          disrupted: false,
          source: 'Public EIA chokepoint baseline plus demo overlay',
          hazardAlertLevel: 'watch',
          hazardAlertName: 'monitoring',
        },
        warRiskTier: 'WAR_RISK_TIER_ELEVATED',
      },
      {
        id: 'suez',
        name: 'Suez Canal',
        lat: 30.59,
        lon: 32.27,
        disruptionScore: 42,
        status: 'yellow',
        activeWarnings: 3,
        congestionLevel: 'elevated',
        affectedRoutes: ['Asia-Europe container routes', 'Mediterranean energy flows'],
        description: 'Public demo signal: route stress proxy for canal-dependent cargo and energy movements.',
        aisDisruptions: 2,
        directions: ['N', 'S'],
        directionalDwt: [
          { direction: 'N', dwtThousandTonnes: 610, wowChangePct: -6.1 },
          { direction: 'S', dwtThousandTonnes: 590, wowChangePct: -1.8 },
        ],
        transitSummary: {
          todayTotal: 48,
          todayTanker: 10,
          todayCargo: 31,
          todayOther: 7,
          wowChangePct: -5.2,
          history: [],
          riskLevel: 'elevated',
          incidentCount7d: 1,
          disruptionPct: 8.1,
          riskSummary: 'Public demo route stress context for planning conversation.',
          riskReportAction: 'Compare public bypass scenario timing against material criticality.',
          dataAvailable: false,
        },
        warRiskTier: 'WAR_RISK_TIER_ELEVATED',
      },
      {
        id: 'malacca_strait',
        name: 'Strait of Malacca',
        lat: 2.5,
        lon: 101.0,
        disruptionScore: 18,
        status: 'green',
        activeWarnings: 0,
        congestionLevel: 'normal',
        affectedRoutes: ['Asia refined product routes', 'Critical mineral shipping lanes'],
        description: 'Public demo signal: high-volume corridor with normal current demo status.',
        aisDisruptions: 0,
        directions: ['E', 'W'],
        directionalDwt: [],
        transitSummary: {
          todayTotal: 94,
          todayTanker: 37,
          todayCargo: 49,
          todayOther: 8,
          wowChangePct: 1.6,
          history: [],
          riskLevel: 'normal',
          incidentCount7d: 0,
          disruptionPct: 1.2,
          riskSummary: 'Normal demo status from public route context.',
          riskReportAction: '',
          dataAvailable: false,
        },
        warRiskTier: 'WAR_RISK_TIER_NORMAL',
      },
      {
        id: 'panama',
        name: 'Panama Canal',
        lat: 9.08,
        lon: -79.68,
        disruptionScore: 28,
        status: 'yellow',
        activeWarnings: 1,
        congestionLevel: 'moderate',
        affectedRoutes: ['US Gulf-Pacific routing', 'Container and bulk alternatives'],
        description: 'Public demo signal: moderate route-planning pressure for canal-sensitive corridors.',
        aisDisruptions: 1,
        directions: ['N', 'S'],
        directionalDwt: [],
        transitSummary: {
          todayTotal: 36,
          todayTanker: 5,
          todayCargo: 27,
          todayOther: 4,
          wowChangePct: -2.3,
          history: [],
          riskLevel: 'moderate',
          incidentCount7d: 1,
          disruptionPct: 4.2,
          riskSummary: 'Moderate public demo pressure for corridor comparison.',
          riskReportAction: 'Use as a public what-if route planning prompt.',
          dataAvailable: false,
        },
        warRiskTier: 'WAR_RISK_TIER_NORMAL',
      },
    ],
  };
}

export function scmDemoCriticalMinerals(): GetCriticalMineralsResponse {
  return {
    fetchedAt: isoNow(),
    upstreamUnavailable: false,
    minerals: [
      {
        mineral: 'Lithium',
        hhi: 3100,
        riskRating: 'elevated',
        globalProduction: 180000,
        unit: 'tonnes LCE',
        topProducers: [
          { country: 'Australia', countryCode: 'AU', productionTonnes: 86000, sharePct: 47.8 },
          { country: 'Chile', countryCode: 'CL', productionTonnes: 44000, sharePct: 24.4 },
          { country: 'China', countryCode: 'CN', productionTonnes: 33000, sharePct: 18.3 },
        ],
      },
      {
        mineral: 'Graphite',
        hhi: 5200,
        riskRating: 'high',
        globalProduction: 1600000,
        unit: 'tonnes',
        topProducers: [
          { country: 'China', countryCode: 'CN', productionTonnes: 1230000, sharePct: 76.9 },
          { country: 'Madagascar', countryCode: 'MG', productionTonnes: 100000, sharePct: 6.3 },
          { country: 'Mozambique', countryCode: 'MZ', productionTonnes: 96000, sharePct: 6.0 },
        ],
      },
      {
        mineral: 'Rare earths',
        hhi: 4300,
        riskRating: 'high',
        globalProduction: 350000,
        unit: 'tonnes REO',
        topProducers: [
          { country: 'China', countryCode: 'CN', productionTonnes: 240000, sharePct: 68.6 },
          { country: 'United States', countryCode: 'US', productionTonnes: 43000, sharePct: 12.3 },
          { country: 'Australia', countryCode: 'AU', productionTonnes: 18000, sharePct: 5.1 },
        ],
      },
    ],
  };
}

export function scmDemoShippingRates(): GetShippingRatesResponse {
  return {
    fetchedAt: isoNow(),
    upstreamUnavailable: false,
    indices: [
      { indexId: 'BDI', name: 'Baltic Dry Index', currentValue: 1830, previousValue: 1765, changePct: 3.7, unit: 'index', history: datedHistory(1700, 35), spikeAlert: false },
      { indexId: 'SCFI', name: 'Shanghai Containerized Freight Index', currentValue: 2140, previousValue: 2210, changePct: -3.2, unit: 'index', history: datedHistory(2200, 45), spikeAlert: false },
      { indexId: 'GSCPI', name: 'Global Supply Chain Pressure Proxy', currentValue: 0.42, previousValue: 0.36, changePct: 16.7, unit: 'z', history: datedHistory(0.25, 0.06), spikeAlert: true },
    ],
  };
}

export function scmDemoShippingStress(): GetShippingStressResponse {
  return {
    fetchedAt: unixNow(),
    upstreamUnavailable: false,
    stressScore: 38,
    stressLevel: 'moderate',
    carriers: [
      { symbol: 'MAERSK-B.CO', name: 'Maersk', price: 12450, changePct: -1.8, carrierType: 'container', sparkline: history(12450) },
      { symbol: 'ZIM', name: 'ZIM Integrated Shipping', price: 18.4, changePct: 2.6, carrierType: 'container', sparkline: history(18.4) },
      { symbol: 'FRO', name: 'Frontline', price: 22.7, changePct: 1.1, carrierType: 'tanker', sparkline: history(22.7) },
    ],
  };
}

export function scmDemoCommodityQuotes(symbols: string[]): ListCommodityQuotesResponse {
  const catalog: Record<string, { name: string; display: string; price: number; change: number }> = {
    'CL=F': { name: 'WTI Crude Oil', display: 'WTI', price: 82.4, change: 1.1 },
    'BZ=F': { name: 'Brent Crude Oil', display: 'Brent', price: 86.2, change: 0.8 },
    'NG=F': { name: 'Natural Gas', display: 'Nat Gas', price: 3.18, change: -1.7 },
    'GC=F': { name: 'Gold', display: 'Gold', price: 2385, change: 0.4 },
    'SI=F': { name: 'Silver', display: 'Silver', price: 29.1, change: -0.2 },
    'HG=F': { name: 'Copper', display: 'Copper', price: 4.62, change: 1.9 },
    'PL=F': { name: 'Platinum', display: 'Platinum', price: 1015, change: 0.6 },
    'PA=F': { name: 'Palladium', display: 'Palladium', price: 940, change: -0.9 },
  };
  const requested = symbols.length ? symbols : Object.keys(catalog);
  return {
    quotes: requested
      .map(symbol => {
        const item = catalog[symbol];
        if (!item) return null;
        return {
          symbol,
          name: item.name,
          display: item.display,
          price: item.price,
          change: item.change,
          sparkline: history(item.price),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null),
  };
}

export function scmDemoCryptoQuotes(): ListCryptoQuotesResponse {
  return {
    quotes: [
      { name: 'Bitcoin', symbol: 'BTC', price: 68420, change: 1.4, sparkline: history(68420), change7d: 3.8 },
      { name: 'Ethereum', symbol: 'ETH', price: 3520, change: 0.9, sparkline: history(3520), change7d: 2.1 },
      { name: 'Solana', symbol: 'SOL', price: 164, change: -0.8, sparkline: history(164), change7d: -1.6 },
    ],
  };
}

export function scmDemoSanctionsPressure(): ListSanctionsPressureResponse {
  const now = String(Date.now());
  return {
    fetchedAt: now,
    datasetDate: now,
    totalCount: 142,
    sdnCount: 118,
    consolidatedCount: 24,
    newEntryCount: 3,
    vesselCount: 11,
    aircraftCount: 2,
    countries: [
      { countryCode: 'RU', countryName: 'Russia', entryCount: 58, newEntryCount: 1, vesselCount: 8, aircraftCount: 1 },
      { countryCode: 'IR', countryName: 'Iran', entryCount: 42, newEntryCount: 1, vesselCount: 3, aircraftCount: 1 },
      { countryCode: 'CN', countryName: 'China', entryCount: 18, newEntryCount: 0, vesselCount: 0, aircraftCount: 0 },
    ],
    programs: [
      { program: 'Energy sector restrictions', entryCount: 34, newEntryCount: 1 },
      { program: 'Shipping and vessel designations', entryCount: 19, newEntryCount: 1 },
      { program: 'Export-control adjacent screening', entryCount: 13, newEntryCount: 0 },
    ],
    entries: [
      { id: 'demo-ofac-vessel-1', name: 'Public demo vessel designation', entityType: 'SANCTIONS_ENTITY_TYPE_VESSEL', countryCodes: ['RU'], countryNames: ['Russia'], programs: ['Shipping and vessel designations'], sourceLists: ['OFAC public list demo'], effectiveAt: now, isNew: true, note: 'Public screening example for demo triage only.' },
      { id: 'demo-ofac-energy-1', name: 'Public demo energy-sector entity', entityType: 'SANCTIONS_ENTITY_TYPE_ENTITY', countryCodes: ['IR'], countryNames: ['Iran'], programs: ['Energy sector restrictions'], sourceLists: ['OFAC public list demo'], effectiveAt: now, isNew: false, note: 'Public screening signal; not a legal determination.' },
    ],
  };
}

export function scmDemoTradeRestrictions(): GetTradeRestrictionsResponse {
  return {
    fetchedAt: isoNow(),
    upstreamUnavailable: false,
    restrictions: [
      { id: 'demo-trade-1', reportingCountry: 'United States', affectedCountry: 'China', productSector: 'Critical minerals and battery inputs', measureType: 'Export-control screening', description: 'Public demo screening context for restricted technology and mineral inputs.', status: 'moderate', notifiedAt: isoNow().slice(0, 10), sourceUrl: 'https://www.wto.org/' },
      { id: 'demo-trade-2', reportingCountry: 'European Union', affectedCountry: 'Russia', productSector: 'Energy equipment', measureType: 'Trade restriction', description: 'Public demo context for energy equipment restrictions and route planning.', status: 'high', notifiedAt: isoNow().slice(0, 10), sourceUrl: 'https://www.wto.org/' },
    ],
  };
}

export function scmDemoTariffTrends(): GetTariffTrendsResponse {
  return {
    fetchedAt: isoNow(),
    upstreamUnavailable: false,
    effectiveTariffRate: {
      sourceName: 'Public demo tariff baseline',
      sourceUrl: 'https://www.wto.org/',
      observationPeriod: String(new Date().getUTCFullYear()),
      updatedAt: isoNow(),
      tariffRate: 4.6,
    },
    datapoints: [2021, 2022, 2023, 2024, 2025].map((year, index) => ({
      reportingCountry: 'United States',
      partnerCountry: 'China',
      productSector: 'Critical minerals proxy',
      year,
      tariffRate: 3.8 + index * 0.25,
      boundRate: 5.5,
      indicatorCode: 'demo-public-mfn',
    })),
  };
}

export function scmDemoTradeFlows(): GetTradeFlowsResponse {
  return {
    fetchedAt: isoNow(),
    upstreamUnavailable: false,
    flows: [2021, 2022, 2023, 2024, 2025].map((year, index) => ({
      reportingCountry: 'United States',
      partnerCountry: 'China',
      year,
      exportValueUsd: 110_000_000_000 + index * 4_500_000_000,
      importValueUsd: 440_000_000_000 - index * 6_000_000_000,
      yoyExportChange: index === 0 ? 0 : 2.1 + index,
      yoyImportChange: index === 0 ? 0 : -1.2 - index * 0.4,
      productSector: 'Public demo strategic goods basket',
    })),
  };
}

export function scmDemoTradeBarriers(): GetTradeBarriersResponse {
  return {
    fetchedAt: isoNow(),
    upstreamUnavailable: false,
    barriers: [
      { id: 'demo-barrier-1', notifyingCountry: 'United States', title: 'Public demo battery-input screening measure', measureType: 'Technical barrier', productDescription: 'Battery and mineral inputs', objective: 'Supply chain due diligence screening context', status: 'notified', dateDistributed: isoNow().slice(0, 10), sourceUrl: 'https://www.wto.org/' },
      { id: 'demo-barrier-2', notifyingCountry: 'European Union', title: 'Public demo energy equipment control context', measureType: 'Import licensing', productDescription: 'Industrial equipment', objective: 'Public compliance screening context', status: 'active', dateDistributed: isoNow().slice(0, 10), sourceUrl: 'https://www.wto.org/' },
    ],
  };
}

export function scmDemoCustomsRevenue(): GetCustomsRevenueResponse {
  return {
    fetchedAt: isoNow(),
    upstreamUnavailable: false,
    months: Array.from({ length: 8 }, (_, index) => ({
      recordDate: new Date(Date.UTC(2025, index, 28)).toISOString().slice(0, 10),
      fiscalYear: 2025,
      calendarYear: 2025,
      calendarMonth: index + 1,
      monthlyAmountBillions: Math.round((7.2 + Math.sin(index / 2) * 0.5 + index * 0.08) * 10) / 10,
      fytdAmountBillions: Math.round((7.2 * (index + 1) + index * 0.4) * 10) / 10,
    })),
  };
}

export function scmDemoComtradeFlows(): ListComtradeFlowsResponse {
  return {
    fetchedAt: isoNow(),
    upstreamUnavailable: false,
    flows: [
      { reporterCode: '840', reporterName: 'United States', partnerCode: '156', partnerName: 'China', cmdCode: '26', cmdDesc: 'Ores, slag and ash', year: 2025, tradeValueUsd: 18_400_000_000, netWeightKg: 4_200_000_000, yoyChange: -6.2, isAnomaly: true },
      { reporterCode: '356', reporterName: 'India', partnerCode: '682', partnerName: 'Saudi Arabia', cmdCode: '27', cmdDesc: 'Mineral fuels and oils', year: 2025, tradeValueUsd: 42_100_000_000, netWeightKg: 38_000_000_000, yoyChange: 3.1, isAnomaly: false },
    ],
  };
}

export function scmDemoPipelines(): ListPipelinesResponse {
  return {
    fetchedAt: isoNow(),
    classifierVersion: 'public-demo-v1',
    upstreamUnavailable: false,
    pipelines: [
      {
        id: 'demo-public-gulf-coast-products',
        name: 'Demo Gulf Coast refined products corridor',
        operator: 'Public infrastructure context',
        commodityType: 'oil',
        fromCountry: 'US',
        toCountry: 'US',
        transitCountries: [],
        capacityBcmYr: 0,
        capacityMbd: 1.2,
        lengthKm: 980,
        inService: 1,
        startPoint: { lat: 29.76, lon: -95.37 },
        endPoint: { lat: 33.75, lon: -84.39 },
        waypoints: [],
        evidence: {
          physicalState: 'flowing',
          physicalStateSource: 'public_demo',
          commercialState: 'public context only',
          sanctionRefs: [],
          lastEvidenceUpdate: isoNow(),
          classifierVersion: 'public-demo-v1',
          classifierConfidence: 0.72,
        },
        publicBadge: 'flowing',
      },
      {
        id: 'demo-public-eu-gas-storage-link',
        name: 'Demo European gas storage link',
        operator: 'Public infrastructure context',
        commodityType: 'gas',
        fromCountry: 'NL',
        toCountry: 'DE',
        transitCountries: ['NL', 'DE'],
        capacityBcmYr: 24,
        capacityMbd: 0,
        lengthKm: 420,
        inService: 1,
        startPoint: { lat: 52.1, lon: 5.3 },
        endPoint: { lat: 51.5, lon: 10.4 },
        waypoints: [],
        evidence: {
          physicalState: 'reduced',
          physicalStateSource: 'public_demo',
          commercialState: 'public context only',
          sanctionRefs: [],
          lastEvidenceUpdate: isoNow(),
          classifierVersion: 'public-demo-v1',
          classifierConfidence: 0.64,
        },
        publicBadge: 'reduced',
      },
    ],
  };
}

export function scmDemoStorageFacilities(): ListStorageFacilitiesResponse {
  return {
    fetchedAt: isoNow(),
    classifierVersion: 'public-demo-v1',
    upstreamUnavailable: false,
    facilities: [
      {
        id: 'demo-eu-gas-storage',
        name: 'Demo European underground gas storage',
        operator: 'Public infrastructure context',
        facilityType: 'ugs',
        country: 'DE',
        location: { lat: 51.2, lon: 10.4 },
        capacityTwh: 245,
        capacityMb: 0,
        capacityMtpa: 0,
        workingCapacityUnit: 'TWh',
        inService: 1,
        evidence: {
          physicalState: 'operational',
          physicalStateSource: 'public_demo',
          commercialState: 'public context only',
          sanctionRefs: [],
          fillDisclosed: true,
          fillSource: 'public storage transparency context',
          lastEvidenceUpdate: isoNow(),
          classifierVersion: 'public-demo-v1',
          classifierConfidence: 0.7,
        },
        publicBadge: 'operational',
      },
      {
        id: 'demo-lng-import-terminal',
        name: 'Demo LNG import terminal',
        operator: 'Public infrastructure context',
        facilityType: 'lng_import',
        country: 'NL',
        location: { lat: 51.95, lon: 4.14 },
        capacityTwh: 0,
        capacityMb: 0,
        capacityMtpa: 12,
        workingCapacityUnit: 'Mtpa',
        inService: 1,
        evidence: {
          physicalState: 'reduced',
          physicalStateSource: 'public_demo',
          commercialState: 'public context only',
          sanctionRefs: [],
          fillDisclosed: false,
          fillSource: '',
          lastEvidenceUpdate: isoNow(),
          classifierVersion: 'public-demo-v1',
          classifierConfidence: 0.62,
        },
        publicBadge: 'reduced',
      },
    ],
  };
}

export function scmDemoFuelShortages(): ListFuelShortagesResponse {
  return {
    fetchedAt: isoNow(),
    classifierVersion: 'public-demo-v1',
    upstreamUnavailable: false,
    shortages: [
      {
        id: 'demo-diesel-watch-eu',
        country: 'DE',
        product: 'diesel',
        severity: 'watch',
        firstSeen: isoNow().slice(0, 10),
        lastConfirmed: isoNow().slice(0, 10),
        resolvedAt: '',
        impactTypes: ['logistics watch', 'public price context'],
        causeChain: ['public supply tightness signal', 'route sensitivity'],
        shortDescription: 'Public demo watch item for diesel availability and logistics sensitivity.',
        evidence: {
          evidenceSources: [
            { authority: 'public_demo', title: 'Public fuel-shortage demo context', url: '/docs/scm-demo-safety.md', date: isoNow().slice(0, 10), sourceType: 'demo' },
          ],
          firstRegulatorConfirmation: '',
          classifierVersion: 'public-demo-v1',
          classifierConfidence: 0.58,
          lastEvidenceUpdate: isoNow(),
        },
      },
      {
        id: 'demo-jet-fuel-watch-asia',
        country: 'SG',
        product: 'jet',
        severity: 'watch',
        firstSeen: isoNow().slice(0, 10),
        lastConfirmed: isoNow().slice(0, 10),
        resolvedAt: '',
        impactTypes: ['aviation fuel watch'],
        causeChain: ['public refinery margin context', 'regional demand proxy'],
        shortDescription: 'Public demo watch item for jet fuel supply chain monitoring.',
        evidence: {
          evidenceSources: [
            { authority: 'public_demo', title: 'Public jet-fuel monitoring demo context', url: '/docs/scm-demo-safety.md', date: isoNow().slice(0, 10), sourceType: 'demo' },
          ],
          firstRegulatorConfirmation: '',
          classifierVersion: 'public-demo-v1',
          classifierConfidence: 0.55,
          lastEvidenceUpdate: isoNow(),
        },
      },
    ],
  };
}

export function scmDemoEnergyDisruptions(): ListEnergyDisruptionsResponse {
  return {
    fetchedAt: isoNow(),
    classifierVersion: 'public-demo-v1',
    upstreamUnavailable: false,
    events: [
      {
        id: 'demo-storage-reduction',
        assetId: 'demo-lng-import-terminal',
        assetType: 'storage',
        eventType: 'maintenance',
        startAt: isoNow(),
        endAt: '',
        capacityOfflineBcmYr: 0,
        capacityOfflineMbd: 0,
        causeChain: ['public maintenance notice proxy', 'reduced availability demo'],
        shortDescription: 'Public demo event: reduced LNG terminal availability for scenario discussion.',
        sources: [
          { authority: 'public_demo', title: 'SCM demo safety note', url: '/docs/scm-demo-safety.md', date: isoNow().slice(0, 10), sourceType: 'demo' },
        ],
        classifierVersion: 'public-demo-v1',
        classifierConfidence: 0.6,
        lastEvidenceUpdate: isoNow(),
        countries: ['NL'],
      },
      {
        id: 'demo-products-corridor-watch',
        assetId: 'demo-public-gulf-coast-products',
        assetType: 'pipeline',
        eventType: 'commercial',
        startAt: isoNow(),
        endAt: '',
        capacityOfflineBcmYr: 0,
        capacityOfflineMbd: 0.12,
        causeChain: ['public logistics watch', 'route sensitivity demo'],
        shortDescription: 'Public demo event: refined-products corridor watch for operational triage conversation.',
        sources: [
          { authority: 'public_demo', title: 'SCM demo safety note', url: '/docs/scm-demo-safety.md', date: isoNow().slice(0, 10), sourceType: 'demo' },
        ],
        classifierVersion: 'public-demo-v1',
        classifierConfidence: 0.57,
        lastEvidenceUpdate: isoNow(),
        countries: ['US'],
      },
    ],
  };
}
