import { SitePage } from '../site-page';
import { viewMeta } from '../page-meta';

export const metadata = viewMeta.portfolio;

export default function Page() {
  return <SitePage view="portfolio" />;
}
