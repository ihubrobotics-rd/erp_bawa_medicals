import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { PrivilegeProvider } from "@/providers/PrivilegeProvider";

// ✅ Import a beautiful robot-like font with fallback support
import { Orbitron, Roboto } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap", // important for slow networks
  fallback: ["Roboto", "system-ui", "Arial", "sans-serif"],
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "bawa-medicals",
  description: "Created with v0",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${orbitron.variable} ${roboto.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <Suspense fallback={<div>Loading...</div>}>
            <QueryProvider>
              <PrivilegeProvider>{children}</PrivilegeProvider>
            </QueryProvider>
          </Suspense>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
