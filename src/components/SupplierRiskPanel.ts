import { Panel } from './Panel';
import { PUBLIC_SUPPLIER_RISK_ARCHETYPES } from '@/config/supplier-risk-archetypes';
import { buildSupplierRiskSummaries } from '@/utils/supplier-risk-signals';
import { escapeHtml } from '@/utils/sanitize';
import type { SupplierRiskSummary } from '@/types/supplier-risk';

const LEVEL_LABEL: Record<SupplierRiskSummary['level'], string> = {
  low: 'Low',
  guarded: 'Guarded',
  elevated: 'Elevated',
  critical: 'Critical',
  unknown: 'Unknown',
};

const POSTURE_LABEL: Record<SupplierRiskSummary['dataPosture'], string> = {
  synthetic_archetype: 'Synthetic archetype',
  public_signal_summary: 'Public-signal summary',
};

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || 'unknown';
  return date.toISOString().slice(0, 10);
}

function formatEvidenceLabel(signal: string): string {
  return signal
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function topReasons(summary: SupplierRiskSummary): string[] {
  if (summary.reasons.length) return summary.reasons.slice(0, 3);
  return ['No elevated public supplier-risk signal detected for this demo archetype.'];
}

export class SupplierRiskPanel extends Panel {
  private summaries: SupplierRiskSummary[] = buildSupplierRiskSummaries(PUBLIC_SUPPLIER_RISK_ARCHETYPES);

  constructor() {
    super({
      id: 'supplier-risk',
      title: 'Supplier Risk Signals',
      defaultRowSpan: 2,
      infoTooltip: 'Public-data SCM demo cards built from synthetic supplier archetypes and open-source route, sanctions/trade, material, and freshness signals.',
    });
    this.render();
  }

  public updateSupplierRiskSummaries(summaries: SupplierRiskSummary[]): void {
    this.summaries = summaries;
    this.render();
  }

  private renderEmpty(): void {
    this.setContent(`
      <div class="supplier-risk-panel">
        <div class="supplier-risk-note">
          No current public supplier-risk signals are available for this SCM demo. This panel does not infer customer-private supplier data.
        </div>
      </div>
    `);
  }

  private render(): void {
    if (!this.summaries.length) {
      this.renderEmpty();
      return;
    }

    const criticalCount = this.summaries.filter(summary => summary.level === 'critical').length;
    const elevatedCount = this.summaries.filter(summary => summary.level === 'elevated').length;
    this.setCount(this.summaries.length);
    this.setSeverity(criticalCount > 0 ? 'high' : elevatedCount > 0 ? 'medium' : 'low');

    const cards = this.summaries.map(summary => {
      const reasons = topReasons(summary)
        .map(reason => `<li>${escapeHtml(reason)}</li>`)
        .join('');
      const evidenceRows = summary.evidence
        .map(item => `
          <tr>
            <td>${escapeHtml(formatEvidenceLabel(item.signal))}</td>
            <td>${escapeHtml(item.source)}</td>
            <td>${escapeHtml(formatTimestamp(item.timestamp))}</td>
            <td>${escapeHtml(item.confidence)}</td>
            <td>${escapeHtml(item.reason)}</td>
          </tr>
        `)
        .join('');
      const chokepoints = summary.transitChokepoints.length
        ? summary.transitChokepoints
            .map(cp => `${cp.chokepointName} ${cp.disruptionScore}/100`)
            .join(', ')
        : 'No modeled disrupted transit chokepoints';
      const stale = summary.staleSignals.length
        ? `<span class="supplier-risk-stale">Stale public signals: ${escapeHtml(summary.staleSignals.join(', '))}</span>`
        : '<span class="supplier-risk-fresh">Fresh public signals</span>';

      return `
        <article class="supplier-risk-card supplier-risk-card-${escapeHtml(summary.level)}">
          <header class="supplier-risk-card-header">
            <div>
              <div class="supplier-risk-title">${escapeHtml(summary.label)}</div>
              <div class="supplier-risk-subtitle">
                ${escapeHtml(summary.exporterLabel)} -> ${escapeHtml(summary.importerLabel)} · HS${escapeHtml(summary.hs2)} ${escapeHtml(summary.productLabel)}
              </div>
            </div>
            <div class="supplier-risk-score">
              <span class="supplier-risk-level">${escapeHtml(LEVEL_LABEL[summary.level])}</span>
              <span>${summary.score}/100</span>
            </div>
          </header>
          <div class="supplier-risk-meta">
            <span>${escapeHtml(POSTURE_LABEL[summary.dataPosture])}</span>
            <span>Confidence ${escapeHtml(summary.confidence)} (${summary.confidenceScore}/100)</span>
            <span>${escapeHtml(stale.replace(/<[^>]+>/g, ''))}</span>
          </div>
          <div class="supplier-risk-materials">
            <span>Materials</span>
            <strong>${escapeHtml(summary.materials.length ? summary.materials.join(', ') : 'No public material mapping')}</strong>
          </div>
          <div class="supplier-risk-route">
            <span>Route/chokepoints</span>
            <strong>${escapeHtml(chokepoints)}</strong>
          </div>
          <ul class="supplier-risk-reasons">${reasons}</ul>
          <details class="supplier-risk-evidence">
            <summary>Evidence (${summary.evidence.length})</summary>
            <table>
              <thead>
                <tr>
                  <th>Signal</th>
                  <th>Source</th>
                  <th>Timestamp</th>
                  <th>Confidence</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>${evidenceRows}</tbody>
            </table>
          </details>
          <div class="supplier-risk-foot">${stale}</div>
        </article>
      `;
    }).join('');

    this.setContent(`
      <div class="supplier-risk-panel">
        <div class="supplier-risk-note">
          Public-data SCM demo. Supplier records are synthetic archetypes or public-signal summaries; this panel does not show customer-private suppliers, logistics, commercial terms, inventory, or site-sensitive records.
        </div>
        <div class="supplier-risk-grid">${cards}</div>
      </div>
    `);
  }
}
