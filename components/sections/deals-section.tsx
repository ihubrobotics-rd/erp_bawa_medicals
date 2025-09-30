"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MedicineCard } from "@/components/medicine/medicine-card"
import type { Medicine } from "@/types/medical"

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
    name: "Prolyte ORS Ready To Drink Body Fluid & Electrolyte",
    brand: "Prolyte",
    genericName: "ORS Solution",
    category: "Medicines",
    subcategory: "Electrolytes",
    price: 22.4,
    mrp: 32.04,
    discount: 30,
    stock: 100,
    minStock: 20,
    description: "Ready to drink ORS for electrolyte balance",
    dosage: "As directed by physician",
    packSize: "box of 200.0 ml Liquid",
    manufacturer: "Abbott",
    expiryDate: "2025-05-31",
    batchNumber: "PR005",
    prescription: false,
    images: ["/ors-drink.jpg"],
    tags: ["ORS", "electrolytes", "rehydration"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "6",
    name: "I-Feel Gentle Intimate Wash I Safe during Pregnancy",
    brand: "I-Feel",
    genericName: "Intimate Wash",
    category: "Personal Care",
    subcategory: "Women Care",
    price: 129,
    mrp: 175,
    discount: 26,
    stock: 35,
    minStock: 8,
    description: "Gentle intimate wash safe for pregnancy",
    dosage: "Use as directed",
    packSize: "pump bottle of 100.0 ml",
    manufacturer: "I-Feel",
    expiryDate: "2025-07-31",
    batchNumber: "IF006",
    prescription: false,
    images: ["/intimate-wash.jpg"],
    tags: ["intimate care", "women health", "pregnancy safe"],
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

export function DealsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 4
  const maxIndex = Math.max(0, mockMedicines.length - itemsPerView)

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1))
  }

  const handleAddToCart = (medicine: Medicine) => {
    console.log("Adding to cart:", medicine.name)
    // TODO: Implement cart functionality
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Deals of the day</h2>
          <Button
            variant="outline"
            className="text-primary border-primary hover:bg-primary hover:text-white bg-transparent"
          >
            SEE ALL
          </Button>
        </div>

        <div className="relative">
          <div className="flex gap-4 overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {mockMedicines.map((medicine) => (
                <div key={medicine.id} className="flex-shrink-0 w-1/4">
                  <MedicineCard medicine={medicine} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
