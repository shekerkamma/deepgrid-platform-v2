import { SitePage } from '../../site-page';
import { companyMeta } from '../../page-meta';

export const metadata = companyMeta('recognition');

export default function Page() {
  return <SitePage view="about" page="recognition" />;
}
