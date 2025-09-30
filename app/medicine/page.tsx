
import { ProductCard } from "@/components/medicine/product-card"; // Import your new card component
import { MedicalHeader } from "@/components/layout/medical-header"
import Footer from "@/components/layout/footer";


interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default async function ProductsPage() {
  const res = await fetch("https://fakestoreapi.com/products");
  const products: Product[] = await res.json();

  return (
    <div className="min-h-screen bg-background">
    <MedicalHeader />
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Available Products</h1>

      {/* Grid for product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
    <Footer />
    </div>
  );
}