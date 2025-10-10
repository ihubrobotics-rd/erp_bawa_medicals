'use client';

import { useQuery } from '@tanstack/react-query';
import { getSubmoduleSchema } from '@/lib/api/privileges';

export const useSubmoduleSchema = (submoduleId?: string) => {
  return useQuery({
    queryKey: ['submoduleSchema', submoduleId],
    queryFn: () => getSubmoduleSchema(submoduleId!),
    enabled: !!submoduleId,
  });
};
