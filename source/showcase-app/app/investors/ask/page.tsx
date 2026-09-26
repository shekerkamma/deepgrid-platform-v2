import { SitePage } from '../../site-page';
import { viewMeta } from '../../page-meta';

export const metadata = viewMeta.briefing;

export default function Page() {
  return <SitePage view="briefing" />;
}
