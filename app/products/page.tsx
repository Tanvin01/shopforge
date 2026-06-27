import { db } from "@/lib/db";
import ProductCard from "@/components/store/ProductCard";
interface Props { searchParams: { category?: string; q?: string; } }
export default async function ProductsPage({ searchParams }: Props) {
  const products = await db.product.findMany({
    where: { active: true, ...(searchParams.q && { name: { contains: searchParams.q, mode: "insensitive" } }) },
    include: { category: true, reviews: { select: { rating: true } } }, orderBy: { createdAt: "desc" }, take: 24,
  });
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Products ({products.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map(p => <ProductCard key={p.id} product={p as any} />)}
      </div>
    </div>
  );
}
