import { notFound } from "next/navigation";
import ShopCategoryPageClient from "@/components/ShopCategoryPageClient";
import { findCategoryBySlug } from "@/lib/assortment";

export default async function ShopCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = findCategoryBySlug(slug);

  if (!result) {
    notFound();
  }

  return <ShopCategoryPageClient section={result.section} category={result.category} />;
}
