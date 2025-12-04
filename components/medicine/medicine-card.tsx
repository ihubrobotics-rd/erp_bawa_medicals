"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Medicine } from "@/types/medical";

interface MedicineCardProps {
    medicine: Medicine;
    onAddToCart?: (medicine: Medicine) => void;
}

export function MedicineCard({ medicine, onAddToCart }: MedicineCardProps) {
    const discountPercentage = Math.round(
        ((medicine.mrp - medicine.price) / medicine.mrp) * 100
    );

    return (
        <Card
            className="
        relative cursor-pointer overflow-hidden group
        rounded-2xl border border-gray-200 dark:border-gray-800
        bg-white dark:bg-[#0d0d0e]
        shadow-sm hover:shadow-xl
        transition-all duration-300 hover:-translate-y-2
        w-full h-full
      "
        >
            {/* Glow gradient */}
            <div
                className="
          absolute inset-0 rounded-2xl opacity-0 
          group-hover:opacity-100 transition-all duration-500
          bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20
          blur-xl
        "
            ></div>

            <CardContent className="relative z-10 p-4 flex flex-col flex-1">
                {/* Image */}
                <div className="relative mb-4">
                    <Link href={`/medicine/${medicine.id}`}>
                        <div className="w-full h-36 flex items-center justify-center">
                            <Image
                                src={medicine.images[0] || "/placeholder.svg"}
                                alt={medicine.name}
                                width={130}
                                height={130}
                                className="object-contain transition-all duration-300 group-hover:scale-110"
                            />
                        </div>
                    </Link>

                    {discountPercentage > 0 && (
                        <Badge
                            className="
                absolute top-2 left-2 
                bg-gradient-to-r from-rose-500 to-orange-500 
                text-white shadow-md
                rounded-md px-2 py-0.5 text-xs font-semibold
              "
                        >
                            {discountPercentage}% OFF
                        </Badge>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="
              absolute top-2 right-2 
              opacity-0 group-hover:opacity-100 
              transition-all duration-300 
              bg-white/70 dark:bg-black/40 backdrop-blur-md 
              hover:bg-red-500 hover:text-white
              rounded-full
            "
                    >
                        <Heart className="w-4 h-4" />
                    </Button>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                    <Link href={`/medicine/${medicine.id}`}>
                        <h3 className="font-semibold text-sm line-clamp-2 text-foreground dark:text-white">
                            {medicine.name}
                        </h3>

                        <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                            {medicine.packSize} • {medicine.brand}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-primary dark:text-blue-400">
                                ₹{medicine.price}
                            </span>

                            {medicine.mrp > medicine.price && (
                                <span className="text-xs line-through text-gray-400 dark:text-gray-600">
                                    ₹{medicine.mrp}
                                </span>
                            )}
                        </div>

                        <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">
                            Get it by 6pm, Today
                        </p>
                    </Link>

                    <Button
                        variant="outline"
                        onClick={() => onAddToCart?.(medicine)}
                        className="
              w-full mt-4 rounded-xl
              border-primary text-primary 
              hover:bg-primary hover:text-white
              dark:border-blue-400 dark:text-blue-300 
              dark:hover:bg-blue-500 dark:hover:text-black
              flex items-center justify-center gap-2
              transition-all duration-300
            "
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
