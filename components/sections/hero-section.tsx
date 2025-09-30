"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-yellow-400 to-orange-600  py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight ">
              Prioritize Your Health & Stay Ahead of Risks
            </h1>
            <p className="text-xl ">Enjoy up to 50% off on full body checkups</p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <ArrowRight className="w-5 h-5 mr-2" />
              Book Now
            </Button>
          </div>
          <div className="relative">
            <Image
              src="/diverse-healthcare-team.png"
              alt="Healthcare professionals"
              width={600}
              height={400}
              className="rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
