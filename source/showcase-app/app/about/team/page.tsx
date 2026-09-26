import { SitePage } from '../../site-page';
import { companyMeta } from '../../page-meta';

export const metadata = companyMeta('team');

export default function Page() {
  return <SitePage view="about" page="team" />;
}
