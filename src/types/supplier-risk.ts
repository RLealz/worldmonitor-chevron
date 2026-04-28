export type SupplierRiskLevel = 'low' | 'guarded' | 'elevated' | 'critical' | 'unknown';

export type SupplierRiskConfidence = 'high' | 'medium' | 'low';

export type SupplierRiskDataPosture = 'synthetic_archetype' | 'public_signal_summary';

export type SupplierRiskEvidenceSignal =
  | 'country_product'
  | 'route_chokepoint'
  | 'sanctions_trade'
  | 'materials'
  | 'freshness';

export interface SupplierRiskEvidence {
  signal: SupplierRiskEvidenceSignal;
  source: string;
  timestamp: string;
  confidence: SupplierRiskConfidence;
  reason: string;
}

export interface SupplierRiskArchetype {
  id: string;
  label: string;
  dataPosture: SupplierRiskDataPosture;
  exporterIso2: string;
  exporterLabel: string;
  importerIso2: string;
  importerLabel: string;
  hs2: string;
  productLabel: string;
  materials: string[];
  publicSources: string[];
  notes: string;
}

export interface SupplierRiskSourceTimestamps {
  countryProduct?: string;
  routeChokepoint?: string;
  sanctionsTrade?: string;
  materials?: string;
}

export interface SupplierRiskSignalInputs {
  chokepointScores?: Map<string, number>;
  sanctionsCountryIso2s?: Set<string>;
  tradeRestrictedCountryIso2s?: Set<string>;
  materialRiskLabels?: Set<string>;
  sourceTimestamps?: SupplierRiskSourceTimestamps;
  now?: string;
}

export interface SupplierRiskSummary {
  id: string;
  label: string;
  dataPosture: SupplierRiskDataPosture;
  level: SupplierRiskLevel;
  score: number;
  confidence: SupplierRiskConfidence;
  confidenceScore: number;
  exporterIso2: string;
  exporterLabel: string;
  importerIso2: string;
  importerLabel: string;
  hs2: string;
  productLabel: string;
  materials: string[];
  routeIds: string[];
  transitChokepoints: Array<{
    chokepointId: string;
    chokepointName: string;
    disruptionScore: number;
  }>;
  maxDisruptionScore: number;
  evidence: SupplierRiskEvidence[];
  reasons: string[];
  staleSignals: string[];
  generatedAt: string;
}

