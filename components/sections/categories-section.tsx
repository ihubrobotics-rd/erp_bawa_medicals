"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

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
];

export function CategoriesSection() {
    return (
        <section className="py-12 bg-gray-50 dark:bg-[#0D0D0D] transition-all">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10 text-foreground dark:text-white">
                    Shop by Category
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
                    {categories.map((category) => (
                        <Link key={category.id} href={category.href}>
                            <Card
                                className="
              relative cursor-pointer h-full flex flex-col items-center 
              rounded-2xl border border-gray-200 dark:border-gray-800
              bg-white dark:bg-[#0d0d0e]
              shadow-sm hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-1
            "
                            >
                                {/* Glow effect */}
                                <div
                                    className="
                absolute inset-0 rounded-2xl opacity-0
                group-hover:opacity-100 transition-all duration-500
                bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20
                blur-xl
              "
                                ></div>

                                <CardContent className="relative z-10 p-4 text-center flex-1 flex flex-col justify-between">
                                    <div className="mb-3 flex justify-center">
                                        <Image
                                            src={
                                                category.image ||
                                                "/placeholder.svg"
                                            }
                                            alt={category.name}
                                            width={60}
                                            height={60}
                                            className="object-contain"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-sm text-foreground dark:text-white mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                                        {category.count}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
