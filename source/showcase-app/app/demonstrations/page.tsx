import { SitePage } from '../site-page';
import { viewMeta } from '../page-meta';

export const metadata = viewMeta.film;

export default function Page() {
  return <SitePage view="film" />;
}
