import { SitePage } from '../../site-page';
import { viewMeta } from '../../page-meta';

export const metadata = viewMeta.slides;

export default function Page() {
  return <SitePage view="slides" />;
}
