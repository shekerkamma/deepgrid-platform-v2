// Per-page <title> and description in the static HTML, so a shared link or a search result names
// the page itself rather than the home page (document.title only changed after hydration).
import type { Metadata } from 'next';
import { pageById } from './company-pages';
import products from './products.json';
import story from './data/tech-story.json';

const SUFFIX = ' · DeepGrid Semi';
const meta = (title: string, description: string): Metadata => ({
  title: title + SUFFIX,
  description,
  openGraph: { title: title + SUFFIX, description },
});

export const companyMeta = (id: string) => {
  const p = pageById(id)!;
  return meta(p.title, p.lede);
};
export const productMeta = (id: string) => {
  const p = products.find((x) => x.id === id);
  return p ? meta(p.name + ' · Products', p.description) : meta('Products', '');
};
export const chapterMeta = (id: string) => {
  const c = story.chapters.find((x) => x.id === id);
  return c ? meta(c.kicker + ' · Silicon', c.headline) : meta('Silicon', '');
};
export const viewMeta: Record<string, Metadata> = {
  portfolio: meta('Product lines', 'Fifteen products on one 28 nm die: prices, volumes and revenue by line.'),
  silicon: meta('Silicon platform', 'One 28 nm chip, SoC2, carries the whole portfolio. Seven chapters on what it is and what still has to be proven.'),
  film: meta('Demonstrations', 'Narrated simulations and the 104-slide portfolio walkthrough.'),
  investment: meta('Investment case', 'The round, use of funds, milestones and what diligence should test.'),
  slides: meta('Portfolio deck', 'The 104-slide product portfolio, slide by slide.'),
  briefing: meta('Ask DeepGrid', 'Questions answered from the source documents.'),
};
