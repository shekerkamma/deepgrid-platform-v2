import { SitePage } from './site-page';
import { LegacyHashRedirect } from './legacy-hash';

// Home. Old shared links (#portfolio, #film?v=…, #slides?slide=12) land here and are forwarded.
export default function Page() {
  return (
    <>
      <LegacyHashRedirect />
      <SitePage view="overview" />
    </>
  );
}
