'use client';

import { useParams } from 'next/navigation';
import { useSubmoduleSchema } from '@/hooks/useSubmoduleSchema';
import { DynamicCrudPage } from '@/components/features/dynamic-crud-page/DynamicCrudPage';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManageSubmodulePage() {
  const { submoduleId } = useParams() as { submoduleId: string };
  const { data: schema, isLoading, isError } = useSubmoduleSchema(submoduleId);

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

  if (!schema.role_privileges[0]?.can_view) {
    return <div className="p-8">You do not have permission to view this page.</div>;
  }

  return <DynamicCrudPage schema={schema} />;
}
