import { SitePage } from '../../site-page';
import products from '../../products.json';
import { productMeta } from '../../page-meta';

// One page per product (was #portfolio?product=<id>).
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return productMeta((await params).id);
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SitePage view="portfolio" product={id} />;
}
