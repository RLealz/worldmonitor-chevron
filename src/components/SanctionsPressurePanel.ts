import { Panel } from './Panel';
import type { CountrySanctionsPressure, ProgramSanctionsPressure, SanctionsEntry, SanctionsPressureResult } from '@/services/sanctions-pressure';
import type { ComplianceExposureSummary } from '@/types/compliance-exposure';
import { escapeHtml } from '@/utils/sanitize';
import { SITE_VARIANT } from '@/config';

export class SanctionsPressurePanel extends Panel {
  private data: SanctionsPressureResult | null = null;
  private scmComplianceContext: ComplianceExposureSummary[] = [];

  constructor() {
    super({
      id: 'sanctions-pressure',
      title: 'Sanctions & Designations',
      showCount: true,
      trackActivity: true,
      defaultRowSpan: 2,
      infoTooltip: 'OFAC sanctions designations from the SDN and Consolidated Lists. Shows which countries face the highest designation pressure, what programs are driving it, and what has been newly added since the last update.',
    });
    this.showLoading('Loading sanctions data...');
  }

  public setData(data: SanctionsPressureResult): void {
    this.data = data;
    this.setCount(data.totalCount);
    this.render();
  }

  public setScmComplianceContext(summaries: ComplianceExposureSummary[]): void {
    this.scmComplianceContext = summaries;
    this.render();
  }

  private render(): void {
    if (!this.data || this.data.totalCount === 0) {
      const scmNote = this.renderScmComplianceContext();
      this.setContent(`${scmNote}<div class="economic-empty">Public sanctions pressure data unavailable.</div>`);
      return;
    }

    const data = this.data;

    const summaryHtml = `
      <div class="sanctions-summary">
        ${this.renderSummaryCard('New', data.newEntryCount, data.newEntryCount > 0 ? 'highlight' : '')}
        ${this.renderSummaryCard('Vessels', data.vesselCount)}
        ${this.renderSummaryCard('Aircraft', data.aircraftCount)}
      </div>
    `;

    const countriesHtml = data.countries.length > 0
      ? data.countries.slice(0, 8).map((country) => this.renderCountryRow(country)).join('')
      : '<div class="economic-empty">No country attribution available.</div>';

    const entriesHtml = data.entries.length > 0
      ? data.entries.slice(0, 10).map((entry) => this.renderEntryRow(entry)).join('')
      : '<div class="economic-empty">No recent designations.</div>';

    const programsHtml = data.programs.length > 0
      ? data.programs.slice(0, 6).map((program) => this.renderProgramRow(program)).join('')
      : '<div class="economic-empty">No program breakdown.</div>';

    const footer = [
      `Updated ${data.fetchedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      data.datasetDate ? `dataset ${data.datasetDate.toISOString().slice(0, 10)}` : '',
      'Source: OFAC',
    ].filter(Boolean).join(' · ');

    this.setContent(`
      <div class="sanctions-panel-content">
        ${this.renderScmComplianceContext()}
        ${summaryHtml}
        <div class="sanctions-sections">
          <div class="sanctions-section">
            <div class="sanctions-section-title">Sanctioned countries</div>
            <div class="sanctions-list">${countriesHtml}</div>
          </div>
          <div class="sanctions-section">
            <div class="sanctions-section-title">Recent designations</div>
            <div class="sanctions-list">${entriesHtml}</div>
          </div>
          <div class="sanctions-section">
            <div class="sanctions-section-title">Programs</div>
            <div class="sanctions-list">${programsHtml}</div>
          </div>
        </div>
        <div class="economic-footer">${escapeHtml(footer)}</div>
      </div>
    `);
  }

  private renderScmComplianceContext(): string {
    if (SITE_VARIANT !== 'scm' && this.scmComplianceContext.length === 0) return '';

    const relevant = this.scmComplianceContext
      .filter(summary => summary.evidence.some(item => item.signal === 'sanctions_country' || item.signal === 'sanctions_entity_lookup'))
      .slice(0, 3);

    const rows = relevant.length
      ? relevant.map(summary => {
          const topEvidence = summary.evidence.find(item => item.signal === 'sanctions_country' || item.signal === 'sanctions_entity_lookup');
          const chips = [
            summary.exporterLabel,
            summary.productLabel,
            ...summary.materials.slice(0, 2),
          ].map(label => `<span class="scm-compliance-chip">${escapeHtml(label)}</span>`).join('');
          return `
            <div class="scm-compliance-row">
              <div>
                <div class="scm-compliance-row-title">${escapeHtml(summary.supplierArchetypeLabel)}</div>
                <div class="scm-compliance-row-meta">
                  ${escapeHtml(summary.level)} exposure · confidence ${escapeHtml(summary.confidence)} · ${escapeHtml(topEvidence?.sourceList || topEvidence?.sourceName || topEvidence?.source || 'public source')}
                  · ${escapeHtml(topEvidence?.dateLabel || 'public source date unavailable')}
                </div>
              </div>
              <div class="scm-compliance-chips">${chips}</div>
            </div>
          `;
        }).join('')
      : '<div class="scm-compliance-empty">No sanctions screening exposure is currently matched to the public SCM archetypes.</div>';

    return `
      <div class="scm-compliance-note">
        <div class="scm-compliance-note-title">Public SCM screening context</div>
        <div class="scm-compliance-note-copy">
          OFAC-derived public list pressure and optional public entity lookup evidence are screening signals for analyst review, not legal determinations.
        </div>
        <div class="scm-compliance-list">${rows}</div>
      </div>
    `;
  }

  private renderSummaryCard(label: string, value: string | number, tone = ''): string {
    return `
      <div class="sanctions-summary-card ${tone ? `sanctions-summary-card-${tone}` : ''}">
        <span class="sanctions-summary-label">${escapeHtml(label)}</span>
        <span class="sanctions-summary-value">${escapeHtml(String(value))}</span>
      </div>
    `;
  }

  private renderCountryRow(country: CountrySanctionsPressure): string {
    const flags: string[] = [];
    if (country.newEntryCount > 0) flags.push(`<span class="sanctions-pill sanctions-pill-new">+${country.newEntryCount} new</span>`);
    if (country.vesselCount > 0) flags.push(`<span class="sanctions-pill">🚢 ${country.vesselCount}</span>`);
    if (country.aircraftCount > 0) flags.push(`<span class="sanctions-pill">✈ ${country.aircraftCount}</span>`);

    return `
      <div class="sanctions-row">
        <div class="sanctions-row-main">
          <div class="sanctions-row-title">${escapeHtml(country.countryName)}</div>
          <div class="sanctions-row-meta">${escapeHtml(country.countryCode)} · ${country.entryCount} designations</div>
        </div>
        <div class="sanctions-row-flags">${flags.join('')}</div>
      </div>
    `;
  }

  private renderProgramRow(program: ProgramSanctionsPressure): string {
    return `
      <div class="sanctions-row">
        <div class="sanctions-row-main">
          <div class="sanctions-row-title">${escapeHtml(program.program)}</div>
          <div class="sanctions-row-meta">${program.entryCount} designations</div>
        </div>
        <div class="sanctions-row-flags">
          ${program.newEntryCount > 0 ? `<span class="sanctions-pill sanctions-pill-new">+${program.newEntryCount} new</span>` : ''}
        </div>
      </div>
    `;
  }

  private renderEntryRow(entry: SanctionsEntry): string {
    const location = entry.countryNames[0] || entry.countryCodes[0] || 'Unattributed';
    const program = entry.programs[0] || 'Program';
    const note = entry.note ? `<div class="sanctions-entry-note">${escapeHtml(entry.note)}</div>` : '';
    const effective = entry.effectiveAt ? entry.effectiveAt.toISOString().slice(0, 10) : 'undated';

    return `
      <div class="sanctions-entry">
        <div class="sanctions-entry-top">
          <span class="sanctions-entry-name">${escapeHtml(entry.name)}</span>
          <span class="sanctions-pill sanctions-pill-type">${escapeHtml(entry.entityType)}</span>
          ${entry.isNew ? '<span class="sanctions-pill sanctions-pill-new">new</span>' : ''}
        </div>
        <div class="sanctions-entry-meta">${escapeHtml(location)} · ${escapeHtml(program)} · ${escapeHtml(effective)}</div>
        ${note}
      </div>
    `;
  }
}
