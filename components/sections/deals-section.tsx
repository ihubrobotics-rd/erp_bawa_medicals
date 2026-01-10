"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MedicineCard } from "@/components/medicine/medicine-card";
import type { Medicine } from "@/types/medical";

const mockMedicines: Medicine[] = [
  {
    id: "1",
    name: "Protinex High Quality Protein Nutritional Supplement",
    brand: "Protinex",
    genericName: "Protein Supplement",
    category: "Nutrition",
    subcategory: "Protein",
    price: 370,
    mrp: 494,
    discount: 25,
    stock: 50,
    minStock: 10,
    description: "High quality protein supplement for daily nutrition",
    dosage: "1-2 scoops daily",
    packSize: "box of 1.0 kg Powder",
    manufacturer: "Danone",
    expiryDate: "2025-12-31",
    batchNumber: "PT001",
    prescription: false,
    images: ["/protein-powder.jpg"],
    tags: ["protein", "nutrition", "supplement"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Bare Anatomy Anti-Dandruff Shampoo",
    brand: "Bare Anatomy",
    genericName: "Anti-dandruff Shampoo",
    category: "Personal Care",
    subcategory: "Hair Care",
    price: 355,
    mrp: 484,
    discount: 27,
    stock: 30,
    minStock: 5,
    description: "Effective anti-dandruff shampoo for healthy hair",
    dosage: "Apply as needed",
    packSize: "bottle of 250.0 ml Shampoo",
    manufacturer: "Bare Anatomy",
    expiryDate: "2025-06-30",
    batchNumber: "BA002",
    prescription: false,
    images: ["/shampoo-bottle.png"],
    tags: ["hair care", "anti-dandruff", "shampoo"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Control D Blood Glucose Test Strip",
    brand: "Control D",
    genericName: "Glucose Test Strips",
    category: "Medical Devices",
    subcategory: "Diabetes Care",
    price: 743,
    mrp: 1077,
    discount: 31,
    stock: 25,
    minStock: 5,
    description: "Accurate blood glucose test strips for diabetes monitoring",
    dosage: "As directed by physician",
    packSize: "box of 50.0 Test Strips",
    manufacturer: "Control D",
    expiryDate: "2025-03-31",
    batchNumber: "CD003",
    prescription: false,
    images: ["/glucose-test-strips.jpg"],
    tags: ["diabetes", "test strips", "medical device"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "4",
    name: "3M Avagard CHG Handrub Hand Sanitizer",
    brand: "3M",
    genericName: "Hand Sanitizer",
    category: "Personal Care",
    subcategory: "Hygiene",
    price: 749,
    mrp: 998,
    discount: 25,
    stock: 40,
    minStock: 10,
    description: "Professional grade hand sanitizer with CHG",
    dosage: "Apply as needed",
    packSize: "bottle of 500.0 ml Sanitizer",
    manufacturer: "3M",
    expiryDate: "2025-08-31",
    batchNumber: "3M004",
    prescription: false,
    images: ["/hand-sanitizer.jpg"],
    tags: ["sanitizer", "hygiene", "hand care"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
    {
    id: "5",
    name: "3M Avagard CHG Handrub Hand Sanitizer",
    brand: "3M",
    genericName: "Hand Sanitizer",
    category: "Personal Care",
    subcategory: "Hygiene",
    price: 749,
    mrp: 998,
    discount: 25,
    stock: 40,
    minStock: 10,
    description: "Professional grade hand sanitizer with CHG",
    dosage: "Apply as needed",
    packSize: "bottle of 500.0 ml Sanitizer",
    manufacturer: "3M",
    expiryDate: "2025-08-31",
    batchNumber: "3M004",
    prescription: false,
    images: ["/hand-sanitizer.jpg"],
    tags: ["sanitizer", "hygiene", "hand care"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },  {
    id: "6",
    name: "3M Avagard CHG Handrub Hand Sanitizer",
    brand: "3M",
    genericName: "Hand Sanitizer",
    category: "Personal Care",
    subcategory: "Hygiene",
    price: 749,
    mrp: 998,
    discount: 25,
    stock: 40,
    minStock: 10,
    description: "Professional grade hand sanitizer with CHG",
    dosage: "Apply as needed",
    packSize: "bottle of 500.0 ml Sanitizer",
    manufacturer: "3M",
    expiryDate: "2025-08-31",
    batchNumber: "3M004",
    prescription: false,
    images: ["/hand-sanitizer.jpg"],
    tags: ["sanitizer", "hygiene", "hand care"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },  {
    id: "7",
    name: "3M Avagard CHG Handrub Hand Sanitizer",
    brand: "3M",
    genericName: "Hand Sanitizer",
    category: "Personal Care",
    subcategory: "Hygiene",
    price: 749,
    mrp: 998,
    discount: 25,
    stock: 40,
    minStock: 10,
    description: "Professional grade hand sanitizer with CHG",
    dosage: "Apply as needed",
    packSize: "bottle of 500.0 ml Sanitizer",
    manufacturer: "3M",
    expiryDate: "2025-08-31",
    batchNumber: "3M004",
    prescription: false,
    images: ["/hand-sanitizer.jpg"],
    tags: ["sanitizer", "hygiene", "hand care"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },  {
    id: "8",
    name: "3M Avagard CHG Handrub Hand Sanitizer",
    brand: "3M",
    genericName: "Hand Sanitizer",
    category: "Personal Care",
    subcategory: "Hygiene",
    price: 749,
    mrp: 998,
    discount: 25,
    stock: 40,
    minStock: 10,
    description: "Professional grade hand sanitizer with CHG",
    dosage: "Apply as needed",
    packSize: "bottle of 500.0 ml Sanitizer",
    manufacturer: "3M",
    expiryDate: "2025-08-31",
    batchNumber: "3M004",
    prescription: false,
    images: ["/hand-sanitizer.jpg"],
    tags: ["sanitizer", "hygiene", "hand care"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },  {
    id: "9",
    name: "3M Avagard CHG Handrub Hand Sanitizer",
    brand: "3M",
    genericName: "Hand Sanitizer",
    category: "Personal Care",
    subcategory: "Hygiene",
    price: 749,
    mrp: 998,
    discount: 25,
    stock: 40,
    minStock: 10,
    description: "Professional grade hand sanitizer with CHG",
    dosage: "Apply as needed",
    packSize: "bottle of 500.0 ml Sanitizer",
    manufacturer: "3M",
    expiryDate: "2025-08-31",
    batchNumber: "3M004",
    prescription: false,
    images: ["/hand-sanitizer.jpg"],
    tags: ["sanitizer", "hygiene", "hand care"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

export function DealsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const maxIndex = Math.max(0, mockMedicines.length - itemsPerView);

  const handleAddToCart = (medicine: Medicine) => {
    console.log("Adding to cart:", medicine.name);
  };

  // Auto-play effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [maxIndex]);

  return (
    <section className="py-14 bg-gray-50 dark:bg-[#0D0D0D] transition-all">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Deals of the Day
          </h2>

          <Button
            variant="outline"
            className="rounded-xl px-6 py-2 text-primary border-primary
            hover:bg-primary hover:text-white
            dark:text-white dark:border-white/30 dark:hover:bg-white dark:hover:text-black
            shadow-sm transition"
          >
            SEE ALL
          </Button>
        </div>

        {/* SLIDER CONTAINER */}
        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {mockMedicines.map((medicine) => (
              <div key={medicine.id} className="flex-shrink-0 w-1/4 min-w-[250px]">
                <MedicineCard medicine={medicine} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
