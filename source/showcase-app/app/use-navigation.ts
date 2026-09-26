'use client';
import {useEffect, useState} from 'react';
import {isView, pathParam, to} from './routes';

// v2: every view is its own page. The interface the views call is unchanged (navigate, go, update,
// openSlide), but moving to another view is now a page load to its real URL, and a view's own state
// (?category=, ?slide=, ?chapter=) lives in the query string of that page.
export type Route = {view: string; params: URLSearchParams};

export function useNavigation(view: string, fixed: Record<string, string> = {}) {
  const read = () => {
    const p = new URLSearchParams(typeof location === 'undefined' ? '' : location.search);
    for (const [k, v] of Object.entries(fixed)) p.set(k, v);
    return p;
  };
  const [params, setParams] = useState<URLSearchParams>(() => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(fixed)) p.set(k, v);
    return p;
  });
  // Views seed their own state from props once (useState(initial)). The static HTML is rendered
  // without the query string, so a page opened with one (?domain=R100, ?slide=30) remounts its
  // view once, after hydration, from the real URL. Later in-page updates do not remount.
  const [seeded, setSeeded] = useState('ssr');
  useEffect(() => {
    setParams(read());
    if (location.search) setSeeded('url');
    const sync = () => setParams(read());
    addEventListener('popstate', sync);
    return () => removeEventListener('popstate', sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Go to 'view?params'. Same view: change the query in place; another view: load its page. */
  const go = (hash: string, replace = false) => {
    const [v, q = ''] = hash.replace(/^#/, '').split('?');
    const next = new URLSearchParams(q);
    const key = pathParam[v];
    const samePage = !key || (next.get(key) || '') === (fixed[key] || '');
    if (v === view && samePage) {
      for (const k of Object.keys(fixed)) next.delete(k);
      const url = location.pathname + (next.size ? '?' + next : '');
      history[replace ? 'replaceState' : 'pushState'](history.state, '', url);
      setParams(read());
      return;
    }
    location.assign(to(hash));
  };
  const navigate = (v: string) => location.assign(to(v));
  const update = (changes: Record<string, string | undefined>, replace = true) => {
    const next = new URLSearchParams(location.search);
    for (const [k, v] of Object.entries(changes)) { if (v) next.set(k, v); else next.delete(k); }
    history[replace ? 'replaceState' : 'pushState'](history.state, '', location.pathname + (next.size ? '?' + next : ''));
    setParams(read());
  };
  const openSlide = (n: number) => {
    const from = view + (location.search ? location.search : '') + (fixed.product ? (location.search ? '&' : '?') + 'product=' + fixed.product : '');
    location.assign(to('slides?' + new URLSearchParams({slide: String(n), from})));
  };
  return {route: {view, params} as Route, navigate, go, update, openSlide, seeded};
}

/** With <base href> set, a bare '#id' link would jump to the home page. Keep in-page anchors in
 *  the page, and send old view hashes ('#portfolio?product=ad2') to their new pages. */
export function useHashLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || a.target) return;
      const raw = a.getAttribute('href')!.slice(1);
      if (!raw) return;
      e.preventDefault();
      if (isView(raw.split('?')[0])) { location.assign(to(raw)); return; }
      const el = document.getElementById(decodeURIComponent(raw));
      history.replaceState(history.state, '', location.pathname + location.search + '#' + raw);
      el?.scrollIntoView({block: 'start'});
      if (el && el.tabIndex < 0 && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el?.focus({preventScroll: true});
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
