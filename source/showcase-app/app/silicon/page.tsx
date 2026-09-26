import { SitePage } from '../site-page';
import { ChapterRedirect } from './chapter-redirect';

export default function Page() {
  return (
    <>
      <ChapterRedirect />
      <SitePage view="silicon" />
    </>
  );
}
