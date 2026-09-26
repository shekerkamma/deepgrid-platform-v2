import { SitePage } from '../../site-page';
import story from '../../data/tech-story.json';

// One page per Silicon chapter (was one 16,000px page, #silicon?chapter=<id>).
export function generateStaticParams() {
  return story.chapters.map((c) => ({ chapter: c.id }));
}

export default async function Page({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  return <SitePage view="silicon" chapter={chapter} />;
}
