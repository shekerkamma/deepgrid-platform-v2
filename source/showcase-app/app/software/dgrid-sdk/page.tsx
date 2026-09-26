import { SitePage } from '../../site-page';
import { companyMeta } from '../../page-meta';

export const metadata = companyMeta('dgrid-sdk');

export default function Page() {
  return <SitePage view="software" page="dgrid-sdk" />;
}
