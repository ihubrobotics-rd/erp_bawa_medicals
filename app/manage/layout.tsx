// app/(protected)/layout.tsx
import { SuperAdminHeader } from "@/components/layout/super-admin-header"; 

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SuperAdminHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}