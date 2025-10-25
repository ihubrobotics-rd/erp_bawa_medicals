// MedicalHeader.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { categories } from "@/data/catagories";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ui/ModeToggle";
// ✅ IMPORT THE CENTRAL FUNCTION
import { navigateToRoleOrLogin } from "@/lib/api/auth";

const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"];

export function MedicalHeader() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("Mumbai");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // ✅ Simplified handleLogin function
  const handleLogin = async () => {
    // This one function now handles everything:
    // 1. Checks for a token.
    // 2. If no token, routes to /login.
    // 3. If token exists, refreshes if needed.
    // 4. Routes to the correct dashboard based on role.
    await navigateToRoleOrLogin(router);
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        Limited Period Offer: Get up to 25% off + extra 15% off on medicines &
        more offers.{" "}
        <Link href="/offers" className="underline font-medium">
          Explore
        </Link>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-300 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-xl font-bold text-orange-300">B-Medicals</span>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                {location} <ChevronDown className="w-3 h-3" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-48">
              <div className="flex flex-col gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setLocation(city)}
                    className={`text-left px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground ${
                      city === location ? "bg-accent font-medium" : ""
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search for Medicines and Health Products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        {/* Cart */}
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="ghost" size="sm" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="w-5 h-5" />
            <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
              2
            </Badge>
          </Button>
        </div>
      </div>

      {/* Navigation Mega Menu */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-6 py-3 overflow-x-auto horizontal-scroll">
            {categories.map((category) => (
              <Popover
                key={category.name}
                open={hoveredCategory === category.name}
                onOpenChange={(open) => {
                  if (!open) setHoveredCategory(null);
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-1 text-sm font-medium whitespace-nowrap cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(category.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {category.name} <ChevronDown className="w-3 h-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[700px] p-6 grid grid-cols-3 gap-4"
                  onMouseEnter={() => setHoveredCategory(category.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {category.subcategories.map((sub) => (
                    <div key={sub.name} className="flex flex-col gap-1">
                      <span className="font-semibold">{sub.name}</span>
                      {sub.children && (
                        <ul className="pl-2 space-y-1">
                          {sub.children.map((child) => (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className="hover:text-primary text-sm"
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                      {!sub.children && (
                        <Link
                          href={sub.href}
                          className="hover:text-primary text-sm"
                        >
                          View {sub.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}