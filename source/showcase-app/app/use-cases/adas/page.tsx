import { SitePage } from '../../site-page';
import { companyMeta } from '../../page-meta';

export const metadata = companyMeta('adas');

export default function Page() {
  return <SitePage view="usecases" page="adas" />;
}
