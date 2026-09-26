import { SitePage } from '../site-page';
import { companyMeta } from '../page-meta';

export const metadata = companyMeta('story');

export default function Page() {
  return <SitePage view="about" page="story" />;
}
