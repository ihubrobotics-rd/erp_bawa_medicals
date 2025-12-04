"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="bg-gradient-to-r from-yellow-400 to-orange-600 dark:from-orange-700 dark:to-red-800 py-16 text-white dark:text-gray-100 transition-all">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    {/* Left Text */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                            Prioritize Your Health & Stay Ahead of Risks
                        </h1>

                        <p className="text-xl opacity-95">
                            Enjoy up to{" "}
                            <span className="font-bold">50% off</span> on full
                            body checkups
                        </p>

                        <Button
                            size="lg"
                            className="bg-white text-orange-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 shadow-md rounded-xl px-6 py-5 flex items-center gap-2"
                        >
                            <ArrowRight className="w-5 h-5" />
                            Book Now
                        </Button>
                    </div>

                    {/* Right Image */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 blur-2xl rounded-xl scale-105"></div>

                        <Image
                            src="/diverse-healthcare-team.png"
                            alt="Healthcare professionals"
                            width={600}
                            height={400}
                            className="rounded-xl shadow-2xl border border-white/20 dark:border-gray-700 transition group-hover:scale-[1.02]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
