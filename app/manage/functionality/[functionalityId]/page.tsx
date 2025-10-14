'use client';

import { useParams } from 'next/navigation';
import { useFunctionalitySchema } from '@/hooks/useSubmoduleSchema'; 
import { DynamicCrudPage } from '@/components/features/dynamic-crud-page/DynamicCrudPage';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageFunctionalityPage() {
  const { functionalityId } = useParams() as { functionalityId: string };
  const { data: schema, isLoading, isError } = useFunctionalitySchema(functionalityId);

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (isError || !schema) {
    return <div className="p-8 text-red-500">Error: Could not load page configuration.</div>;
  }
  
  // The schema structure from the backend should be consistent
  if (!schema.role_privileges[0]?.can_view) {
    return <div className="p-8">You do not have permission to view this page.</div>;
  }

  // Reuse your existing powerful component!
  return <DynamicCrudPage schema={schema} />;
}