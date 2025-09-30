"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Medicine } from "@/types/medical"

interface MedicineCardProps {
  medicine: Medicine
  onAddToCart?: (medicine: Medicine) => void
}

export function MedicineCard({ medicine, onAddToCart }: MedicineCardProps) {
  const discountPercentage = Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100)

  return (
    <Card className="medicine-card group cursor-pointer flex flex-col h-full">
      <CardContent className="p-4 flex flex-col flex-1">
        {/* Image + Wishlist */}
        <div className="relative mb-3">
          <Link href={`/medicine/${medicine.id}`} className="block">
            <Image
              src={medicine.images[0] || "/placeholder.svg?height=120&width=120&query=medicine"}
              alt={medicine.name}
              width={120}
              height={120}
              className="w-full h-32 object-contain"
            />
          </Link>

          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 offer-badge text-white">{discountPercentage}% off</Badge>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <Link href={`/medicine/${medicine.id}`} className="block">
            <h3 className="font-medium text-sm line-clamp-2 text-foreground">{medicine.name}</h3>
            <p className="text-xs text-muted-foreground">
              {medicine.packSize} | {medicine.brand}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-foreground">₹{medicine.price}</span>
              {medicine.mrp > medicine.price && (
                <span className="text-xs text-muted-foreground line-through">MRP ₹{medicine.mrp}</span>
              )}
            </div>
            <p className="text-xs font-medium text-green-500 mt-1">Get it by 6pm, Today</p>
          </Link>

          {/* Add to Cart Button */}
          <Button
            variant="outline"
            onClick={() => onAddToCart?.(medicine)}
            className="w-full mt-4 hover:bg-chart-5 hover:border-chart-5 hover:text-white text-primary border-primary"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
