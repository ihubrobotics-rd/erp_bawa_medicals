'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/auth';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

// 🔽 API-based dropdown component
export function DynamicDropdown({ field, setValue }: any) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dropdown-options', field.options_api],
    queryFn: async () => {
      const res = await api.get(field.options_api);
      return res.data.data?.results || [];
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading {field.label}...</p>;
  if (isError) return <p className="text-sm text-red-500">Failed to load {field.label}</p>;

  return (
    <Select onValueChange={(value) => setValue(field.input_name, value)}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${field.label}`} />
      </SelectTrigger>
      <SelectContent>
        {data.map((opt: any) => (
          <SelectItem key={opt.id} value={opt.id.toString()}>
            {opt.country_name || opt.name || opt.label || opt.title || `Option ${opt.id}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function StaticDropdown({ field, setValue }: any) {
  let options: any[] = [];

  try {
    options = JSON.parse(
      field.values
        .replace(/\(/g, '[')
        .replace(/\)/g, ']')
        .replace(/'/g, '"')
    );
  } catch (err) {
    console.error('Failed to parse static values:', field.values);
  }

  return (
    <Select onValueChange={(value) => setValue(field.input_name, value)}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${field.label}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt: any, index: number) => (
          <SelectItem key={index} value={opt[0]}>
            {opt[1]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
