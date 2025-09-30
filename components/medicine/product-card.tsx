import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the type for your product, matching the fakestoreapi structure
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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Generate a random discount percentage for visual similarity to your image
  const discount = Math.floor(Math.random() * (20 - 5 + 1)) + 5; // Between 5% and 20%
  const originalPrice = (product.price / (1 - discount / 100)).toFixed(2);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/medicine/${product.id}`} className="block">
        <CardHeader className="p-0 relative h-48 bg-gray-100 flex items-center justify-center">
          {/* Discount Badge */}
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-sm z-10">
            {discount}% off
          </div>
          <Image
            src={product.image}
            alt={product.title}
            width={200} // Adjust width as needed for better display
            height={200} // Adjust height as needed
            className="object-contain max-h-full max-w-full"
            priority={false} // Use false for images not above the fold
          />
        </CardHeader>
      </Link>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-semibold line-clamp-2 min-h-[56px] mb-2">
          <Link href={`/medicine/${product.id}`} className="hover:text-blue-600 transition-colors">
            {product.title}
          </Link>
        </CardTitle>
        {/* Placeholder for "strip of 10 tablets | Crocin" type text */}
        <p className="text-sm text-gray-500 mb-2 line-clamp-1">
          {product.category}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${originalPrice}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          {/* This button could trigger an add to cart action or navigate */}
          <Link href={`/medicine/${product.id}`}>
            Add to Cart
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}