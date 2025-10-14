'use client';

import { useQuery } from '@tanstack/react-query';
import { getSubmoduleSchema, getFunctionalitySchema } from '@/lib/api/privileges';

export const useSubmoduleSchema = (submoduleId?: string) => {
  return useQuery({
    queryKey: ['submoduleSchema', submoduleId],
    queryFn: () => getSubmoduleSchema(submoduleId!),
    enabled: !!submoduleId,
  });
};


export const useFunctionalitySchema = (functionalityId?: string) => {
  return useQuery({
    queryKey: ['functionalitySchema', functionalityId],
    queryFn: () => getFunctionalitySchema(functionalityId!),
    enabled: !!functionalityId,
  });
};