import { SitePage } from '../../site-page';
import { companyMeta } from '../../page-meta';

export const metadata = companyMeta('docs');

export default function Page() {
  return <SitePage view="resources" page="docs" />;
}
