"use client";

import { MedicineCard } from "@/components/medicine/medicine-card";
import type { Medicine } from "@/types/medical";

const featuredMedicines: Medicine[] = [
    {
        id: "7",
        name: "Crocin Advance Tablet",
        brand: "Crocin",
        genericName: "Paracetamol",
        category: "Medicines",
        subcategory: "Pain Relief",
        price: 45,
        mrp: 50,
        discount: 10,
        stock: 200,
        minStock: 50,
        description: "Fast relief from headache and fever",
        dosage: "1-2 tablets every 4-6 hours",
        packSize: "strip of 15 tablets",
        manufacturer: "GSK",
        expiryDate: "2025-12-31",
        batchNumber: "CR007",
        prescription: false,
        images: ["/crocin-tablets.jpg"],
        tags: ["pain relief", "fever", "headache"],
        isActive: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        id: "8",
        name: "Dolo 650 Tablet",
        brand: "Dolo",
        genericName: "Paracetamol",
        category: "Medicines",
        subcategory: "Pain Relief",
        price: 30,
        mrp: 35,
        discount: 14,
        stock: 150,
        minStock: 30,
        description: "Effective pain and fever relief",
        dosage: "1 tablet every 4-6 hours",
        packSize: "strip of 15 tablets",
        manufacturer: "Micro Labs",
        expiryDate: "2025-10-31",
        batchNumber: "DL008",
        prescription: false,
        images: ["/dolo-tablets.jpg"],
        tags: ["pain relief", "fever", "paracetamol"],
        isActive: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        id: "9",
        name: "Vicks VapoRub",
        brand: "Vicks",
        genericName: "Menthol Ointment",
        category: "Personal Care",
        subcategory: "Cold & Cough",
        price: 85,
        mrp: 95,
        discount: 11,
        stock: 80,
        minStock: 15,
        description: "Relief from cold and cough symptoms",
        dosage: "Apply externally as needed",
        packSize: "jar of 50ml",
        manufacturer: "P&G",
        expiryDate: "2025-09-30",
        batchNumber: "VK009",
        prescription: false,
        images: ["/vicks-vaporub.jpg"],
        tags: ["cold", "cough", "menthol"],
        isActive: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        id: "10",
        name: "Cetirizine 10mg Tablet",
        brand: "Generic",
        genericName: "Cetirizine",
        category: "Medicines",
        subcategory: "Allergy",
        price: 25,
        mrp: 30,
        discount: 17,
        stock: 120,
        minStock: 25,
        description: "Antihistamine for allergy relief",
        dosage: "1 tablet once daily",
        packSize: "strip of 10 tablets",
        manufacturer: "Various",
        expiryDate: "2025-11-30",
        batchNumber: "CT010",
        prescription: true,
        images: ["/cetirizine-tablets.png"],
        tags: ["allergy", "antihistamine", "prescription"],
        isActive: true,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
];

export function FeaturedSection() {
    const handleAddToCart = (medicine: Medicine) => {
        console.log("Adding to cart:", medicine.name);
        // TODO: Implement cart functionality
    };

    return (
        <section className="py-12 bg-gray-50 dark:bg-[#0D0D0D] transition-all">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-foreground dark:text-white">
                        Skincare Picks Just for You
                    </h2>
                    <span className="text-sm font-medium text-primary dark:text-blue-400">
                        Add
                    </span>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredMedicines.map((medicine) => (
                        <MedicineCard
                            key={medicine.id}
                            medicine={medicine}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
