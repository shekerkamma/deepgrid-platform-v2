import { SitePage } from '../site-page';
import { ChapterRedirect } from './chapter-redirect';
import { viewMeta } from '../page-meta';

export const metadata = viewMeta.silicon;

export default function Page() {
  return (
    <>
      <ChapterRedirect />
      <SitePage view="silicon" />
    </>
  );
}
