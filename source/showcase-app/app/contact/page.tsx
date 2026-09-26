import { SitePage } from '../site-page';
import { companyMeta } from '../page-meta';

export const metadata = companyMeta('contact');

export default function Page() {
  return <SitePage view="contact" page="contact" />;
}
