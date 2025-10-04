// components/shared/AccessDenied.tsx
import { ShieldAlert } from 'lucide-react';

export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-8">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="text-muted-foreground mt-2">
        You do not have the necessary permissions to view this page.
      </p>
    </div>
  );
}