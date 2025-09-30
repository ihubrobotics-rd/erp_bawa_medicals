"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    id: "1",
    name: "Vitamins & Supplements",
    image: "/assorted-vitamins.png",
    href: "/category/vitamins",
    count: "2000+ products",
  },
  {
    id: "2",
    name: "Diabetes Care",
    image: "/diabetes-care.jpg",
    href: "/category/diabetes",
    count: "500+ products",
  },
  {
    id: "3",
    name: "Heart Care",
    image: "/heart-care.jpg",
    href: "/category/heart-care",
    count: "300+ products",
  },
  {
    id: "4",
    name: "Skin Care",
    image: "/skin-care-products.png",
    href: "/category/skin-care",
    count: "1500+ products",
  },
  {
    id: "5",
    name: "Baby Care",
    image: "/placeholder-rpsna.png",
    href: "/category/baby-care",
    count: "800+ products",
  },
  {
    id: "6",
    name: "Women Care",
    image: "/women-care.jpg",
    href: "/category/women-care",
    count: "600+ products",
  },
  {
    id: "7",
    name: "Ayurvedic",
    image: "/ayurvedic-medicine.jpg",
    href: "/category/ayurvedic",
    count: "1200+ products",
  },
  {
    id: "8",
    name: "Homeopathy",
    image: "/homeopathy.jpg",
    href: "/category/homeopathy",
    count: "400+ products",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
  {categories.map((category) => (
    <Link key={category.id} href={category.href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <CardContent className="p-4 text-center flex-1 flex flex-col justify-between">
          <div className="mb-3">
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              width={60}
              height={60}
              className="mx-auto"
            />
          </div>
          <h3 className="font-medium text-sm mb-1">{category.name}</h3>
          <p className="text-xs text-muted-foreground">{category.count}</p>
        </CardContent>
      </Card>
    </Link>
  ))}
</div>

      </div>
    </section>
  )
}
