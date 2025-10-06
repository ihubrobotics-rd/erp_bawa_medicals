'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import api from '@/lib/api/auth'; // Your configured axios instance

// Import your yet-to-be-created generic UI components
import { DynamicCrudPage } from '@/components/features/dynamic-crud-page/DynamicCrudPage';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have a skeleton component

// The TanStack Query function to fetch the schema for a page
const getSubmoduleSchema = async (submoduleId: string) => {
  if (!submoduleId) return null;
  const { data } = await api.get(`/Privilege/submodules/combined/?submodule_id=${submoduleId}`);
  return data.data; // Return the nested 'data' object
};

export default function ManageSubmodulePage() {
  const params = useParams();
  const submoduleId = params.submoduleId as string;

  const { data: schema, isLoading, isError } = useQuery({
    queryKey: ['submoduleSchema', submoduleId],
    queryFn: () => getSubmoduleSchema(submoduleId),
    enabled: !!submoduleId, 
  });

  if (isLoading) {
    // A good place for a detailed skeleton loader
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
  
  // If the user doesn't have view access, block them.
  if (!schema.role_privileges[0]?.can_view) {
      return <div className="p-8">You do not have permission to view this page.</div>
  }

  return <DynamicCrudPage schema={schema} />;
}