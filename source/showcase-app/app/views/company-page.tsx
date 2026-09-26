'use client';
// Renders a Software / Use case / About / Contact page from app/company-pages.ts, in the showcase's
// look: the showcase's SectionHead, its tokens, and a small set of section shapes taken from
// deepgridsemi.com's templates (split, card grid, steps, stats, people, figures, contact, CTA).
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { SectionHead } from '../shared';
import { films, Player } from './films';
import { explainers } from './explainers';
import type { CompanyPage, Person, Section } from '../company-pages';

// Scenes are concept renders; posters are stills from DeepGrid's simulators; the rest are illustrations.
const captionFor = (src: string) => (src.includes('/scenes/') ? 'Concept render' : src.includes('/posters/') ? 'Simulation still' : 'Illustration');

function Figure({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={'cp-figure ' + className}>
      <img src={src} alt={alt} loading="lazy" decoding="async" />
      <figcaption>{captionFor(src)}</figcaption>
    </figure>
  );
}

function PersonCard({ p }: { p: Person }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="cp-person">
      <div className="cp-person-head">
        {p.photo ? <img src={p.photo} alt={'Portrait of ' + p.name} width={72} height={72} loading="lazy" /> : <span className="cp-initials" aria-hidden="true">{p.initials}</span>}
        <div>
          <h3>{p.name}</h3>
          <p className="cp-role">{p.role}</p>
        </div>
      </div>
      {p.detail && <p className="cp-detail">{p.detail}</p>}
      {p.bio && (
        <>
          <button type="button" className="text-link cp-bio-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? 'Hide bio' : 'See bio'}
          </button>
          {open && <ul className="cp-bio">{p.bio.map((b) => <li key={b}>{b}</li>)}</ul>}
        </>
      )}
    </article>
  );
}

const INTERESTS = ['AI Accelerators', 'Software Solutions', 'Complete Systems', 'Partnership Opportunities', 'Other'];
const OFFICE_MAP = 'https://www.openstreetmap.org/search?query=T-Hub%2C%20Knowledge%20City%2C%20Hyderabad';

// deepgridsemi.com's contact page: a message form, contact information, a demo booking and the office.
// This site is static, so the form composes an email to group@deepgrid.in in the visitor's own mail app.
function ContactBlock() {
  const [sent, setSent] = useState(false);
  return (
    <section className="cp-sec cp-contact-page">
      <form
        className="cp-card cp-form"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const get = (k: string) => String(f.get(k) || '').trim();
          const subject = 'Enquiry' + (get('interest') ? ': ' + get('interest') : '') + (get('company') ? ' · ' + get('company') : '');
          const body = [get('message'), '', '—', get('name'), get('email'), get('company')].filter((x, i) => x || i < 3).join('\n');
          location.href = 'mailto:group@deepgrid.in?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
          setSent(true);
        }}
      >
        <h2>Send Us a Message</h2>
        <label><span className="cp-field">Name <b aria-hidden="true">*</b></span><input name="name" required autoComplete="name" /></label>
        <label><span className="cp-field">Email <b aria-hidden="true">*</b></span><input name="email" type="email" required autoComplete="email" /></label>
        <label>Company<input name="company" autoComplete="organization" /></label>
        <label>Interest
          <select name="interest" defaultValue="">
            <option value="">Select an option</option>
            {INTERESTS.map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
        <label><span className="cp-field">Message <b aria-hidden="true">*</b></span><textarea name="message" required rows={5} /></label>
        <button type="submit" className="primary">Send Message</button>
        <p className="cp-detail" role="status">{sent ? 'Your email app should now be open with the message ready to send.' : 'Opens your email app with the message addressed to group@deepgrid.in.'}</p>
      </form>
      <div className="cp-contact-side">
        <div className="cp-card">
          <Mail size={20} aria-hidden="true" />
          <h2>Contact Information</h2>
          <p><span className="cp-meta">Email</span><br /><a className="text-link" href="mailto:group@deepgrid.in">group@deepgrid.in</a></p>
          <p><span className="cp-meta">Headquarters</span><br />T-Hub, Floor-7<br />Hyderabad, India</p>
        </div>
        <div className="cp-card">
          <ArrowUpRight size={20} aria-hidden="true" />
          <h2>Schedule a Demo</h2>
          <p>See our AI accelerators in action with a personalized demonstration</p>
          <p><a className="primary" href="mailto:group@deepgrid.in?subject=Demo%20request">Book Demo</a></p>
        </div>
        <div className="cp-card">
          <MapPin size={20} aria-hidden="true" />
          <h2>Visit Our Office</h2>
          <p>T-Hub, Floor-7, Knowledge City, Hyderabad, India</p>
          <p><a className="text-link" href={OFFICE_MAP} target="_blank" rel="noopener noreferrer">Find us on the map <ArrowUpRight size={14} aria-hidden="true" /></a></p>
        </div>
      </div>
    </section>
  );
}

function Block({ s }: { s: Section }) {
  switch (s.kind) {
    case 'split':
      return (
        <section className={'cp-sec cp-split' + (s.image ? '' : ' cp-split-solo')}>
          <div className="cp-split-text">
            {s.kicker && <p className="kicker">{s.kicker}</p>}
            <h2>{s.title}</h2>
            {s.lede && <p className="cp-lede">{s.lede}</p>}
            {s.paras.map((p) => <p key={p}>{p}</p>)}
          </div>
          {s.image && <Figure src={s.image} alt={s.imageAlt || ''} />}
        </section>
      );
    case 'cards':
      return (
        <section className="cp-sec">
          <header className="cp-sec-head">
            {s.kicker && <p className="kicker">{s.kicker}</p>}
            <h2>{s.title}</h2>
            {s.lede && <p className="cp-lede">{s.lede}</p>}
          </header>
          <div className={'cp-cards cp-cols-' + s.cols}>
            {s.items.map((c) => {
              const inner = (
                <>
                  {c.image && <img className="cp-card-img" src={c.image} alt="" loading="lazy" decoding="async" />}
                  {c.meta && <p className="cp-meta">{c.meta}</p>}
                  <h3>{c.title}</h3>
                  {c.text && <p>{c.text}</p>}
                  {c.href && <span className="cp-card-go">Read more <ArrowRight size={14} aria-hidden="true" /></span>}
                </>
              );
              return c.href ? <a key={c.title} className="cp-card cp-card-link" href={c.href}>{inner}</a> : <article key={c.title} className="cp-card">{inner}</article>;
            })}
          </div>
        </section>
      );
    case 'steps':
      return (
        <section className="cp-sec">
          <header className="cp-sec-head">
            {s.kicker && <p className="kicker">{s.kicker}</p>}
            <h2>{s.title}</h2>
            {s.lede && <p className="cp-lede">{s.lede}</p>}
          </header>
          <ol className="cp-steps">
            {s.items.map((c, i) => (
              <li key={c.title}><span className="cp-step-n" aria-hidden="true">{i + 1}</span><h3>{c.title}</h3>{c.text && <p>{c.text}</p>}</li>
            ))}
          </ol>
        </section>
      );
    case 'stats':
      return (
        <section className="cp-sec cp-stats" aria-label="Key figures">
          {s.items.map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}
        </section>
      );
    case 'people':
      return (
        <section className="cp-sec">
          <header className="cp-sec-head">
            {s.kicker && <p className="kicker">{s.kicker}</p>}
            <h2>{s.title}</h2>
          </header>
          <div className="cp-people">{s.people.map((p) => <PersonCard key={p.name} p={p} />)}</div>
        </section>
      );
    case 'figures':
      return (
        <section className="cp-sec">
          <header className="cp-sec-head"><h2>{s.title}</h2></header>
          <div className="cp-figures">
            {s.items.map((f) => (
              <figure key={f.src} className="cp-figure">
                <img src={f.src} alt={f.alt} width={f.w} height={f.h} loading="lazy" decoding="async" />
                <figcaption>{f.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      );
    case 'contact':
      return <ContactBlock />;
    case 'roster':
      return (
        <section className="cp-sec">
          <header className="cp-sec-head">
            {s.kicker && <p className="kicker">{s.kicker}</p>}
            <h2>{s.title}</h2>
            {s.lede && <p className="cp-lede">{s.lede}</p>}
          </header>
          <div className="cp-roster">
            {s.groups.map((g) => (
              <div key={g.title} className="cp-card">
                <h3>{g.title} <span className="cp-count">{g.people.length}</span></h3>
                <ul>{g.people.map(([n, r]) => <li key={n}><strong>{n}</strong><span>{r}</span></li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      );
    case 'films':
      return (
        <section className="cp-sec">
          <header className="cp-sec-head">
            {s.kicker && <p className="kicker">{s.kicker}</p>}
            <h2>{s.title}</h2>
            {s.lede && <p className="cp-lede">{s.lede}</p>}
          </header>
          <div className={'cp-films' + (s.ids.length > 1 ? ' cp-films-multi' : '')}>
            {s.ids.map((id) => [...films, ...explainers].find((f) => f.id === id)).filter((f) => !!f).map((f) => (
              <figure key={f.id} className="cp-film">
                <Player film={f} />
                <figcaption><strong>{f.title}</strong><span>{f.sub} · {f.length}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>
      );
    case 'bullets':
      return (
        <section className="cp-sec">
          <header className="cp-sec-head">
            {s.kicker && <p className="kicker">{s.kicker}</p>}
            <h2>{s.title}</h2>
          </header>
          <ul className="cp-bullets">{s.items.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>
      );
    case 'cta':
      return (
        <section className="cp-sec cp-cta">
          <h2>{s.title}</h2>
          <p>{s.lede}</p>
          <div className="cp-actions">
            {s.actions.map((a) => <a key={a.label} className={a.primary ? 'primary' : 'text-link'} href={a.href}>{a.label} <ArrowRight size={16} aria-hidden="true" /></a>)}
          </div>
        </section>
      );
    default: {
      // A kind added to Section without a case here fails the type check instead of rendering nothing.
      const missing: never = s;
      return missing;
    }
  }
}

export default function CompanyPageView({ page }: { page: CompanyPage }) {
  return (
    <div className="page-wrap cp-page" data-sections={page.sections.length}>
      <SectionHead kicker={page.kicker} title={page.title} copy={page.lede} />
      {(page.heroImage || page.chips) && (
        <div className={'cp-hero' + (page.heroImage ? '' : ' cp-hero-solo')}>
          {page.heroImage && <Figure className="cp-hero-img" src={page.heroImage.src} alt={page.heroImage.alt} />}
          {page.chips && (
            <ul className="cp-chips">
              {page.chips.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
            </ul>
          )}
        </div>
      )}
      {page.sections.map((s, i) => <Block key={i} s={s} />)}
    </div>
  );
}
