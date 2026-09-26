// Real routes for DeepGrid Platform v2. The showcase was one page with seven hash views
// (#overview … #investment); v2 gives each its own URL, on deepgridsemi.com's information
// architecture. Views still speak the old vocabulary (go('portfolio?product=ad2')), so `to()`
// translates a view hash into a path, and every old shared link keeps working.

/** The Pages prefix, with a trailing slash ('/' in dev). */
export const BASE = ((process.env.NEXT_PUBLIC_PAGES_BASE as string | undefined) || '/').replace(/\/?$/, '/');

/** Where each of the seven original views now lives, relative to BASE. */
// No trailing slashes: pages export as products.html, investors/ask.html, which GitHub Pages
// serves at /products and /investors/ask (a trailing-slash export made the prerenderer 308 and skip).
export const viewPath: Record<string, string> = {
  overview: '',
  portfolio: 'products',
  silicon: 'silicon',
  film: 'demonstrations',
  investment: 'investors',
  slides: 'investors/portfolio-deck',
  briefing: 'investors/ask',
};

export const isView = (v: string) => Object.prototype.hasOwnProperty.call(viewPath, v);

/** '#portfolio?product=ad2&x=1' or 'portfolio?product=ad2' → '/…/products/ad2?x=1'.
 *  Anything whose first segment is not a view is an in-page anchor and stays '#…'. */
export function to(hash: string): string {
  const raw = hash.replace(/^#/, '');
  const [v, q = ''] = raw.split('?');
  if (!isView(v)) return '#' + raw;
  const params = new URLSearchParams(q);
  let path = viewPath[v];
  const product = v === 'portfolio' ? params.get('product') : null;
  if (product) { path += '/' + product; params.delete('product'); }
  return BASE + path + (params.size ? '?' + params : '');
}

/** Absolute URL of a site asset, for places that must not rely on <base>. */
export const asset = (p: string) => BASE + p.replace(/^\.?\//, '');
