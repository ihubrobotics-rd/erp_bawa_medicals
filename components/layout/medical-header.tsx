// MedicalHeader.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    ShoppingCart,
    MapPin,
    ChevronDown,
    MenuIcon,
} from "lucide-react";
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
import { navigateToRoleOrLogin } from "@/lib/api/auth";

const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"];

export function MedicalHeader() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("Mumbai");
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogin = async () => {
        await navigateToRoleOrLogin(router);
    };

    // 🚀 FIX: Disable background scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [mobileMenuOpen]);

    return (
        <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-border dark:border-gray-700 sticky top-0 z-50 shadow-sm">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 text-center text-sm tracking-wide">
                Limited Period Offer: Get up to 25% + extra 20% off on medicines
                & more.
                <Link href="/offers" className="underline font-semibold ml-1">
                    Explore
                </Link>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition">
                        <span className="text-white font-bold text-xl">B</span>
                    </div>
                    <span className="text-2xl font-extrabold text-orange-500 tracking-tight">
                        B-Medicals
                    </span>
                </Link>

                {/* Mobile Right Section */}
                <div className="flex items-center gap-2 md:hidden">
                    <ModeToggle />
                    <button
                        className="p-2 rounded-lg hover:bg-accent"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <MenuIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Desktop Section */}
                <div className="hidden md:flex flex-1 items-center gap-6">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-1 rounded-lg hover:bg-accent px-3 py-1.5"
                                >
                                    {location}
                                    <ChevronDown className="w-3 h-3" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-52 rounded-xl shadow-lg border p-3 bg-white dark:bg-gray-900 dark:border-gray-700">
                                <div className="flex flex-col gap-2">
                                    {cities.map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => setLocation(city)}
                                            className={`text-left px-3 py-2 rounded-lg transition ${
                                                city === location
                                                    ? "bg-primary/10 text-primary font-medium"
                                                    : "hover:bg-accent hover:text-accent-foreground"
                                            }`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search for Medicines and Health Products"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-xl border bg-gray-50 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700 transition shadow-sm focus:ring-2 focus:ring-orange-400 w-full"
                        />
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-lg hover:bg-accent px-4 py-2"
                            onClick={handleLogin}
                        >
                            Login
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative rounded-xl hover:bg-accent transition p-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 text-white shadow-md">
                                2
                            </Badge>
                        </Button>

                        <ModeToggle />
                    </div>
                </div>
            </div>

            {/* Mega Menu (Desktop) */}
            <div className="border-t border-border dark:border-gray-700 bg-white dark:bg-gray-900 hidden md:block">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-6 py-3 overflow-x-auto horizontal-scroll">
                        {categories.map((category) => (
                            <Popover
                                key={category.name}
                                open={hoveredCategory === category.name}
                                onOpenChange={(open) =>
                                    !open && setHoveredCategory(null)
                                }
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center gap-1 text-sm font-medium whitespace-nowrap rounded-lg hover:bg-accent px-3 py-2 transition"
                                        onMouseEnter={() =>
                                            setHoveredCategory(category.name)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredCategory(null)
                                        }
                                    >
                                        {category.name}
                                        <ChevronDown className="w-3 h-3" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    className="w-[700px] p-6 grid grid-cols-3 gap-4 rounded-xl shadow-lg border bg-white dark:bg-gray-900 dark:border-gray-700"
                                    onMouseEnter={() =>
                                        setHoveredCategory(category.name)
                                    }
                                    onMouseLeave={() =>
                                        setHoveredCategory(null)
                                    }
                                >
                                    {category.subcategories.map((sub) => (
                                        <div
                                            key={sub.name}
                                            className="flex flex-col gap-1"
                                        >
                                            <span className="font-semibold text-primary">
                                                {sub.name}
                                            </span>

                                            {sub.children ? (
                                                <ul className="pl-2 space-y-1">
                                                    {sub.children.map(
                                                        (child) => (
                                                            <li
                                                                key={child.name}
                                                            >
                                                                <Link
                                                                    href={
                                                                        child.href
                                                                    }
                                                                    className="hover:text-primary text-sm"
                                                                >
                                                                    {child.name}
                                                                </Link>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            ) : (
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

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden bg-white dark:bg-gray-900 border-t border-border dark:border-gray-700 shadow-lg
                    w-full absolute top-full left-0 z-40
                    max-h-[75vh] overflow-y-auto"
                >
                    <div className="flex flex-col px-4 py-3 gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search for Medicines"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 w-full"
                            />
                        </div>

                        {/* Categories */}
                        {categories.map((category) => (
                            <div key={category.name} className="flex flex-col">
                                <span className="font-semibold py-2 border-b border-border dark:border-gray-700">
                                    {category.name}
                                </span>

                                {category.subcategories.map((sub) =>
                                    sub.children ? (
                                        <ul
                                            key={sub.name}
                                            className="pl-4 py-1 space-y-1"
                                        >
                                            {sub.children.map((child) => (
                                                <li key={child.name}>
                                                    <Link
                                                        href={child.href}
                                                        className="text-sm"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
                                            className="pl-4 py-1 block text-sm"
                                        >
                                            View {sub.name}
                                        </Link>
                                    )
                                )}
                            </div>
                        ))}

                        {/* Login + ModeToggle */}
                        <div className="flex items-center gap-3 mt-3">
                            <ModeToggle />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-lg hover:bg-accent px-4 py-2"
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
