'use client';
// Product → die. The site's claim is "one silicon, fifteen products"; this shows it. Pick a product and the SoC2
// domains it runs on light up on the three.js model (app/silicon.tsx). The product-to-domain map is the one the
// home page and the Six domains chapter already use (`domains[].carries` in shared.tsx), so the three places
// cannot disagree. The chipset is sold as the bare die, so it lights all six.
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Silicon from './silicon';
import { domains, products, groups, type Go } from './shared';

const lines = groups.filter((g) => g !== 'All products');

export function domainsFor(productId: string): number[] {
  if (productId === 'chipset') return domains.map((_, i) => i);
  return domains.flatMap((d, i) => ((d.carries as readonly string[]).includes(productId) ? [i] : []));
}

function Stage({ lit, reduced, label }: { lit: number[]; reduced: boolean; label: string }) {
  const [motion, setMotion] = useState(true);
  return (
    <div className="dm-stage">
      <Silicon selected={lit} exploded={false} reduced={reduced || !motion} />
      <p className="dm-stage-note">{label}</p>
      <button
        type="button"
        className="small-button dm-motion"
        aria-pressed={!reduced && motion}
        disabled={reduced}
        onClick={() => setMotion(!motion)}
      >
        {reduced ? 'Reduced motion enabled' : motion ? 'Pause rotation' : 'Resume rotation'}
      </button>
    </div>
  );
}

function Readout({ id, go, self = false }: { id: string; go: Go; self?: boolean }) {
  const p = products.find((x) => x.id === id)!;
  const lit = domainsFor(id);
  const all = lit.length === domains.length;
  return (
    <div className="dm-readout" aria-live="polite">
      <p className="dm-product">{p.name}</p>
      <p className="dm-runs">
        {all ? 'Sold as the bare SoC2 die: all six domains.' : lit.length === 1 ? 'Runs on one of the six domains:' : `Runs on ${lit.length} of the six domains:`}
      </p>
      {!all && (
        <ul className="dm-domains">
          {lit.map((i) => (
            <li key={domains[i].code}>
              <strong>{domains[i].code}</strong> {domains[i].name}
            </li>
          ))}
        </ul>
      )}
      <p className="dm-links">
        {!self && <a href={'#portfolio?product=' + id} onClick={(e) => { if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); go('portfolio?product=' + id); }}>
          The {p.name} <ArrowRight size={14} aria-hidden="true" />
        </a>}
        {!all && (
          <a href={'#silicon?chapter=domains&domain=' + domains[lit[0]].code}>
            The {domains[lit[0]].code} domain <ArrowRight size={14} aria-hidden="true" />
          </a>
        )}
      </p>
    </div>
  );
}

/** Silicon hub: every product, and the die lighting the domains each one runs on. */
export function DieMap({ reduced, go }: { reduced: boolean; go: Go }) {
  const [id, setId] = useState('ad2');
  const lit = domainsFor(id);
  return (
    <section className="dm" aria-labelledby="dm-title">
      <Stage lit={lit} reduced={reduced} label="Drag to rotate. Conceptual layout, not a mask. 39.3 TOPS is a design target." />
      <div className="dm-side">
        <h2 id="dm-title">Pick a product. See where it runs.</h2>
        <p className="dm-lede">Fifteen products, one 28&nbsp;nm die. Firmware decides which domains a product switches on.</p>
        <div className="dm-picker" role="group" aria-label="Products">
          {lines.map((line) => (
            <div key={line} className="dm-line">
              <p className="dm-line-title">{line}</p>
              <div className="dm-chips">
                {products.filter((p) => p.category === line).map((p) => (
                  <button key={p.id} type="button" aria-pressed={p.id === id} onClick={() => setId(p.id)}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Readout id={id} go={go} />
      </div>
    </section>
  );
}

/** A product page: the same die, lit where this product runs. */
export function ProductDie({ productId, reduced, go }: { productId: string; reduced: boolean; go: Go }) {
  const p = products.find((x) => x.id === productId);
  if (!p) return null;
  return (
    <section className="dm dm-compact" aria-labelledby="dm-p-title">
      <Stage lit={domainsFor(productId)} reduced={reduced} label="Drag to rotate. Conceptual layout, not a mask." />
      <div className="dm-side">
        <h2 id="dm-p-title">On the die</h2>
        <Readout id={productId} go={go} self />
      </div>
    </section>
  );
}
