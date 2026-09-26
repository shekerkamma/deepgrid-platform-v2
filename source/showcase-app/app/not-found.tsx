import { BASE } from './routes';
import { NotFoundRedirect } from './not-found-redirect';

export const metadata = { title: 'Page not found · DeepGrid Semi' };

// GitHub Pages serves 404.html for any unknown path. Keep it in the site's look and point back in.
export default function NotFound() {
  const links: [string, string][] = [
    ['', 'Home'], ['products', 'Products'], ['silicon', 'Silicon'], ['use-cases/adas', 'Use cases'],
    ['investors', 'Investors'], ['demonstrations', 'Demonstrations'], ['contact', 'Contact'],
  ];
  return (
    <main className="page-wrap nf-page" id="main">
      <NotFoundRedirect />
      <p className="kicker">404</p>
      <h1>This page is not here.</h1>
      <p>The link may be from the earlier single-page showcase, or the page may have moved. These are the main sections:</p>
      <nav aria-label="Main sections" className="nf-links">
        {links.map(([href, label]) => <a key={href} href={BASE + href}>{label}</a>)}
      </nav>
    </main>
  );
}
