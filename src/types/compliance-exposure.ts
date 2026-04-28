export type ComplianceExposureLevel = 'low' | 'guarded' | 'elevated' | 'critical' | 'unknown';

export type ComplianceExposureConfidence = 'high' | 'medium' | 'low';

export type ComplianceExposureDataPosture = 'public_screening_signal';

export type ComplianceExposureSignal =
  | 'country_product'
  | 'sanctions_country'
  | 'sanctions_entity_lookup'
  | 'trade_restriction'
  | 'trade_barrier'
  | 'tariff'
  | 'trade_flow'
  | 'freshness';

export interface ComplianceExposureProvenance {
  source: string;
  sourceName?: string;
  sourceList?: string;
  sourceUrl?: string;
  timestamp: string;
  dateLabel: string;
  confidence: ComplianceExposureConfidence;
  reason: string;
}

export interface ComplianceExposureEvidence extends ComplianceExposureProvenance {
  signal: ComplianceExposureSignal;
  severity: number;
}

export interface ComplianceExposureContextLink {
  kind: 'supplier_archetype' | 'country' | 'product' | 'material' | 'route';
  id: string;
  label: string;
}

export interface ComplianceExposureSummary {
  id: string;
  label: string;
  dataPosture: ComplianceExposureDataPosture;
  level: ComplianceExposureLevel;
  score: number;
  confidence: ComplianceExposureConfidence;
  confidenceScore: number;
  supplierArchetypeId: string;
  supplierArchetypeLabel: string;
  exporterIso2: string;
  exporterLabel: string;
  importerIso2: string;
  importerLabel: string;
  hs2: string;
  productLabel: string;
  materials: string[];
  routeIds: string[];
  contextLinks: ComplianceExposureContextLink[];
  evidence: ComplianceExposureEvidence[];
  reasons: string[];
  staleSignals: ComplianceExposureSignal[];
  generatedAt: string;
}

export interface ComplianceExposureCountryPressureInput {
  countryCode: string;
  countryName: string;
  entryCount: number;
  newEntryCount?: number;
  vesselCount?: number;
  aircraftCount?: number;
}

export interface ComplianceExposureProgramInput {
  program: string;
  entryCount: number;
  newEntryCount?: number;
}

export interface ComplianceExposureSanctionsPressureInput {
  fetchedAt?: string | Date;
  datasetDate?: string | Date | null;
  countries?: ComplianceExposureCountryPressureInput[];
  programs?: ComplianceExposureProgramInput[];
}

export interface ComplianceExposureEntityLookupInput {
  query: string;
  source: string;
  fetchedAt?: string | Date;
  results: Array<{
    id: string;
    name: string;
    entityType: string;
    countryCodes: string[];
    programs: string[];
  }>;
}

export interface ComplianceExposureTradeRestrictionInput {
  reportingCountry: string;
  affectedCountry?: string;
  productSector?: string;
  measureType?: string;
  description?: string;
  status?: string;
  notifiedAt?: string;
  sourceUrl?: string;
}

export interface ComplianceExposureTariffInput {
  fetchedAt?: string;
  effectiveTariffRate?: {
    sourceName?: string;
    sourceUrl?: string;
    observationPeriod?: string;
    updatedAt?: string;
    tariffRate?: number;
  };
  datapoints?: Array<{
    reportingCountry: string;
    partnerCountry: string;
    productSector?: string;
    year: number;
    tariffRate: number;
  }>;
}

export interface ComplianceExposureTradeBarrierInput {
  notifyingCountry: string;
  title?: string;
  measureType?: string;
  productDescription?: string;
  objective?: string;
  status?: string;
  dateDistributed?: string;
  sourceUrl?: string;
}

export interface ComplianceExposureTradeFlowInput {
  reportingCountry?: string;
  partnerCountry?: string;
  reporterName?: string;
  partnerName?: string;
  productSector?: string;
  cmdCode?: string;
  cmdDesc?: string;
  year?: number;
  yoyExportChange?: number;
  yoyImportChange?: number;
  yoyChange?: number;
  isAnomaly?: boolean;
}

export interface ComplianceExposureTradeInputs {
  restrictions?: {
    fetchedAt?: string;
    restrictions?: ComplianceExposureTradeRestrictionInput[];
  };
  tariffs?: ComplianceExposureTariffInput;
  barriers?: {
    fetchedAt?: string;
    barriers?: ComplianceExposureTradeBarrierInput[];
  };
  flows?: {
    fetchedAt?: string;
    flows?: ComplianceExposureTradeFlowInput[];
  };
  comtrade?: {
    fetchedAt?: string;
    flows?: ComplianceExposureTradeFlowInput[];
  };
}

export interface ComplianceExposureInputs {
  sanctionsPressure?: ComplianceExposureSanctionsPressureInput;
  entityLookups?: ComplianceExposureEntityLookupInput[];
  trade?: ComplianceExposureTradeInputs;
  now?: string;
}
