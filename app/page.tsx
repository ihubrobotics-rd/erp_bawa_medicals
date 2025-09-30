"use client"

import { MedicalHeader } from "@/components/layout/medical-header"
import { HeroSection } from "@/components/sections/hero-section"
import { DealsSection } from "@/components/sections/deals-section"
import { CategoriesSection } from "@/components/sections/categories-section"
import { FeaturedSection } from "@/components/sections/featured-section"
import Footer from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MedicalHeader />
      <main>
        <HeroSection />
        <DealsSection />
        <CategoriesSection />
        <FeaturedSection />
      </main>
      <Footer />
    </div>
  )
}
