import { SitePage } from '../site-page';
import { viewMeta } from '../page-meta';

export const metadata = viewMeta.investment;

export default function Page() {
  return <SitePage view="investment" />;
}
