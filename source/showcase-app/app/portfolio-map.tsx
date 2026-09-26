'use client';
// The portfolio at a glance: every product's FY2032 revenue, grouped by line, as a ranked dot plot. A bubble chart
// was the first idea; the five compute products all sit between ₹25 and ₹54 Cr, where bubbles overlap and their
// labels collide, so each product gets its own row instead. Position is revenue, dot size is FY2032 units, dot
// shade is gross margin. Figures are products.json, which sums to the financial model v3 total (₹1,128 Cr).
import { products, groups, type Product } from './shared';

const lines = groups.filter((g) => g !== 'All products');
const units = (p: Product) => Number(String(p.units).split('@')[0].replace(/[^\d]/g, '')) || 0;
const margin = (p: Product) => Number(String(p.margin).replace('%', '')) || 0;
const MAX_REV = Math.max(...products.map((p) => p.revenueNum));
const MAX_UNITS = Math.max(...products.map(units));
const TOTAL = products.reduce((s, p) => s + p.revenueNum, 0);
const cr = (n: number) => '₹' + (Math.round(n * 10) / 10).toLocaleString('en-IN') + ' Cr';

export function PortfolioMap({ open }: { open: (p: Product) => void }) {
  return (
    <figure className="pm" aria-labelledby="pm-title">
      <figcaption className="pm-head">
        <h2 id="pm-title">Where FY2032 revenue comes from</h2>
        <p>
          {cr(TOTAL)} across fifteen products, by product line. Dot size is FY2032 units, shade is gross margin.
          Management projections from the financial model, not results.
        </p>
      </figcaption>
      <div className="pm-legend" aria-hidden="true">
        <span><i className="pm-dot" style={{ width: 8, height: 8 }} /> fewer units</span>
        <span><i className="pm-dot" style={{ width: 22, height: 22 }} /> more units</span>
        <span><i className="pm-dot" style={{ opacity: 0.45 }} /> 50% margin</span>
        <span><i className="pm-dot" style={{ opacity: 1 }} /> 94% margin</span>
      </div>
      {lines.map((line) => {
        const items = products.filter((p) => p.category === line).sort((a, b) => b.revenueNum - a.revenueNum);
        const sum = items.reduce((s, p) => s + p.revenueNum, 0);
        return (
          <section key={line} className="pm-line" aria-label={`${line}, ${cr(sum)}`}>
            <h3>
              {line} <span>{cr(sum)} · {Math.round((sum / TOTAL) * 100)}%</span>
            </h3>
            <ol>
              {items.map((p) => {
                const pct = (p.revenueNum / MAX_REV) * 100;
                const size = 8 + 18 * Math.sqrt(units(p) / MAX_UNITS);
                const shade = 0.35 + 0.65 * ((margin(p) - 50) / 44);
                return (
                  <li key={p.id}>
                    <a
                      href={'#portfolio?product=' + p.id}
                      onClick={(e) => {
                        if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                        e.preventDefault();
                        open(p);
                      }}
                      aria-label={`${p.name}: ${cr(p.revenueNum)} FY2032 revenue, ${p.units.replace('@', 'in')} units, ${p.margin} gross margin`}
                    >
                      <span className="pm-name">{p.name}</span>
                      <span className="pm-track">
                        <span className="pm-stem" style={{ width: `${pct}%` }} />
                        <span className="pm-dot" style={{ left: `${pct}%`, width: size, height: size, opacity: Math.max(0.35, Math.min(1, shade)) }} />
                      </span>
                      <span className="pm-value">{cr(p.revenueNum)}</span>
                      <span className="pm-meta">{p.margin} margin · {p.units.replace(' @ FY32', ' units')} · from {p.firstRevenue}</span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </figure>
  );
}
