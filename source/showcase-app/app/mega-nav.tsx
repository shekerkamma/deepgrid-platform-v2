'use client';
// The primary menu, on deepgridsemi.com's information architecture (a home entry with the D icon,
// then dropdowns per subject) in the showcase's own look. Each dropdown is a disclosure: a button
// with aria-expanded controlling a panel of links. It opens on click, on hover with a pointer, and
// from the keyboard; Escape and a click outside close it.
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { products, groups } from './shared';
import story from './data/tech-story.json';
import { to, BASE } from './routes';
import { companyPages } from './company-pages';

type Item = { label: string; href: string; note?: string };
type Menu = { id: string; label: string; views: string[]; columns: { title?: string; items: Item[] }[] };

const lines = groups.filter((g) => g !== 'All products');

export const menus: Menu[] = [
  {
    id: 'products',
    label: 'Products',
    views: ['portfolio'],
    columns: [
      ...lines.map((line) => ({
        title: line,
        items: products.filter((p) => p.category === line).map((p) => ({ label: p.name, href: to('portfolio?product=' + p.id) })),
      })),
      { items: [{ label: 'All fifteen products', href: to('portfolio'), note: 'Compare prices, volumes and revenue' }] },
    ],
  },
  {
    id: 'silicon',
    label: 'Silicon',
    views: ['silicon'],
    columns: [
      {
        items: [
          { label: 'All seven chapters', href: to('silicon'), note: 'One 28 nm chip, SoC2, carries the whole portfolio' },
          ...story.chapters.map((c) => ({ label: c.kicker, href: to('silicon?chapter=' + c.id), note: c.headline })),
        ],
      },
    ],
  },
  {
    id: 'investors',
    label: 'Investors',
    views: ['investment', 'slides', 'briefing'],
    columns: [
      {
        items: [
          { label: 'Investment case', href: to('investment'), note: 'The round, use of funds, milestones and what diligence should test' },
          { label: 'Portfolio deck', href: to('slides'), note: 'The 104-slide narrative, slide by slide' },
          { label: 'Ask DeepGrid', href: to('briefing'), note: 'Questions answered from the source documents' },
        ],
      },
    ],
  },
];

const fromPages = (menu: string) => companyPages.filter((p) => p.menu === menu).map((p) => ({ label: p.label, href: BASE + p.path, note: p.lede }));
menus.push(
  { id: 'software', label: 'Software', views: ['software'], columns: [{ items: fromPages('software') }] },
  { id: 'usecases', label: 'Use Cases', views: ['usecases'], columns: [{ items: fromPages('usecases') }] },
  { id: 'about', label: 'About', views: ['about'], columns: [{ items: fromPages('about') }] },
);

/** The menu in the reference site's order: dropdowns and plain links interleaved. */
type Entry = { menu: string } | { view: string; label: string; href: string };
const order: Entry[] = [
  { menu: 'products' }, { menu: 'silicon' }, { menu: 'software' }, { menu: 'usecases' }, { menu: 'investors' },
  { view: 'film', label: 'Demonstrations', href: to('film') },
  { menu: 'about' },
  { view: 'contact', label: 'Contact', href: BASE + 'contact' },
];

export function MegaNav({ view, onNavigate, label = 'Primary navigation' }: { view: string; onNavigate?: () => void; label?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(null); };
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const was = open; setOpen(null);
      (root.current?.querySelector(`[aria-controls="menu-${was}"]`) as HTMLElement | null)?.focus();
    };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <nav className="main-nav mega-nav" aria-label={label} ref={root}>
      <a href={to('overview')} className={'mega-home' + (view === 'overview' ? ' active' : '')} aria-current={view === 'overview' ? 'page' : undefined} onClick={onNavigate}>
        <img src="brand/deepgrid-d-64.png" alt="" aria-hidden="true" width={20} height={20} />
        Deepgrid Semi
      </a>
      {order.map((e) => {
        if ('view' in e) {
          return (
            <a key={e.view} href={e.href} className={view === e.view ? 'active' : ''} aria-current={view === e.view ? 'page' : undefined} onClick={onNavigate}>
              {e.label}
            </a>
          );
        }
        const m = menus.find((x) => x.id === e.menu)!;
        const isOpen = open === m.id;
        const active = m.views.includes(view);
        return (
          <div key={m.id} className="mega-item" onMouseEnter={(e) => { if (matchMedia('(hover: hover)').matches) setOpen(m.id); void e; }} onMouseLeave={() => { if (matchMedia('(hover: hover)').matches) setOpen(null); }}>
            <button type="button" className={'mega-trigger' + (active ? ' active' : '')} aria-expanded={isOpen} aria-controls={'menu-' + m.id} onClick={() => setOpen(isOpen ? null : m.id)}>
              {m.label}
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div id={'menu-' + m.id} className={'mega-panel mega-cols-' + m.columns.length} hidden={!isOpen}>
              {m.columns.map((col, i) => (
                <div key={i} className="mega-col">
                  {col.title && <p className="mega-col-title">{col.title}</p>}
                  <ul>
                    {col.items.map((it) => (
                      <li key={it.href}>
                        <a href={it.href} onClick={() => { setOpen(null); onNavigate?.(); }}>
                          <span>{it.label}</span>
                          {it.note && <small>{it.note}</small>}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
