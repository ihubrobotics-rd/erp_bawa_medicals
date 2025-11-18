"use client";

import Link from "next/link";
import { Shield, Menu } from "lucide-react";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { UserMenu } from "./UserMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface HeaderTopBarProps {
    roleName: string | null;
    onLogout: () => void;
}

export const HeaderTopBar = ({ roleName, onLogout }: HeaderTopBarProps) => {
    return (
        <div className="w-full bg-white dark:bg-gray-900 dark:border-gray-700">
            <div className="max-w-[95%] lg:max-w-[90%] mx-auto px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-between">
                {/* Logo Section */}
                <Link
                    href="/"
                    className="flex items-center gap-2 sm:gap-3 shrink-0 hover:opacity-80 transition-opacity"
                >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-lg sm:text-xl">B</span>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Bawa Medicals
                        </span>
                        <div className="hidden xs:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                            Super Admin Portal
                        </div>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <ModeToggle />
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <UserMenu roleName={roleName} onLogout={onLogout} />
                </div>

                {/* Mobile Navigation */}
                <div className="flex md:hidden items-center gap-2">
                    <ModeToggle />
                    
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 sm:w-72">
                            <div className="flex flex-col gap-6 pt-6">
                                {/* User Info */}
                                <div className="flex flex-col gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
                                        <span className="text-white font-bold text-lg">B</span>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {roleName || "User"}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Super Admin
                                        </p>
                                    </div>
                                </div>

                                {/* Mobile Menu Items */}
                                <div className="flex flex-col gap-4">
                                    <Button
                                        variant="ghost"
                                        className="justify-start text-gray-700 dark:text-gray-300"
                                        onClick={onLogout}
                                    >
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
};