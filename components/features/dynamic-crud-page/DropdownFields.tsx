'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api/auth';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

// Define proper types
interface Option {
  id: number | string;
  [key: string]: any;
}

interface Field {
  id: string;
  input_name: string;
  label: string;
  is_required?: boolean;
  input_type?: string;
  placeholder?: string;
  values?: string | { label: string; value: string }[];
  options_api?: string;
  detail_api?: string;
  mapping?: string;
}

interface DynamicDropdownProps {
  field: Field;
  schema: Field[];
  setValue: (...args: any[]) => void;
  watch: (...args: any[]) => any;
}

interface StaticDropdownProps {
  field: Field;
  setValue: (name: string, value: any, options?: any) => void;
  watch: (name?: string | string[]) => any;
}

const getOptionLabel = (option: Option, field: Field): string => {
  const specificNameKey = `${field.input_name}_name`;
  if (option[specificNameKey]) {
    return String(option[specificNameKey]);
  }
  const fallbackKeys = [
    'name',
    'label',
    'title',
    'state_name',
    'country_name',
    'designation_name',
    'code',
    'transport_type',
    'currency_code',
    'username',
    'category_name'
  ];
  for (const key of fallbackKeys) {
    if (option[key]) return String(option[key]);
  }
  return `Option ${option.id}`;
};

export function DynamicDropdown({ field, schema, setValue, watch }: DynamicDropdownProps) {
  const currentValue = watch(field.input_name);
  const isTargetField = schema.some(
    (otherField: Field) => otherField.mapping === field.input_name
  );

  const isDisabled = isTargetField && !!currentValue;

  const { data: options = [], isLoading, isError } = useQuery<Option[]>({
    queryKey: ['dropdown-options', field.options_api],
    queryFn: async () => {
      if (!field.options_api) return [];
      const res = await api.get(field.options_api);
      return res.data.data?.results || res.data.data || [];
    },
    enabled: !!field.options_api,
  });

  const { mutate: fetchDetailsAndUpdateForm } = useMutation({
    mutationFn: async (selectedId: string | number) => {
      if (!field.detail_api || !field.mapping) return null;
      const detailUrl = field.detail_api.replace('<int:pk>', selectedId.toString());
      const res = await api.get(detailUrl);
      return res.data.data;
    },
    onSuccess: (data) => {
      if (!data || !field.mapping) return;
      const targetFieldName = field.mapping;
      const valueToSet = data[targetFieldName];
      if (valueToSet !== undefined && valueToSet !== null) {
        setValue(targetFieldName, valueToSet.toString(), { shouldValidate: true });
      }
    },
    onError: (error) => {
      console.error("Failed to fetch details for mapping:", error);
    },
  });

  const handleValueChange = (value: string) => {
    setValue(field.input_name, value, { shouldValidate: true });
    if (field.mapping) {
      setValue(field.mapping, null, { shouldValidate: true });
    }
    if (field.detail_api && field.mapping) {
      fetchDetailsAndUpdateForm(value);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground mt-2">Loading {field.label}...</p>;
  }
  
  if (isError) {
    return <p className="text-sm text-red-500 mt-2">Failed to load {field.label}</p>;
  }
  
  if (!options.length) {
    return (
      <p className="text-sm text-muted-foreground mt-2">
        No {field.label} data available
      </p>
    );
  }

  return (
    <Select
      onValueChange={handleValueChange}
      value={currentValue ? String(currentValue) : ''}
      disabled={isDisabled}
    >
      <SelectTrigger className="mt-2 w-full max-w-[250px]">
        <SelectValue
          placeholder={`Select ${field.label}`}
          className="truncate"
        />
      </SelectTrigger>

      <SelectContent className="max-h-60 overflow-auto">
        {options.map((opt: Option) => (
          <SelectItem key={opt.id} value={String(opt.id)}>
            {getOptionLabel(opt, field)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function StaticDropdown({ field, setValue, watch }: StaticDropdownProps): any {
  const currentValue = watch(field.input_name);
  let options: [string, string][] = [];

  try {
    if (typeof field.values === "string") {
      // Parse Django-style tuple string
      const formatted = field.values
        .replace(/^\[|\]$/g, "")
        .split(/\),\s*\(/)
        .map((pair) =>
          pair
            .replace(/[\[\]\(\)']/g, "")
            .split(",")
            .map((v) => v.trim())
        )
        .filter((pair): pair is [string, string] => pair.length === 2);

      options = formatted;
    } else if (Array.isArray(field.values)) {
      // Parse array of objects
      options = field.values.map((v) => [v.value, v.label]);
    }
  } catch (err) {
    console.error("Failed to parse static values:", field.values, err);
  }

  return (
    <Select
      onValueChange={(value) => setValue(field.input_name, value, { shouldValidate: true })}
      value={currentValue ? String(currentValue) : ''}
    >
      <SelectTrigger className="mt-2">
        <SelectValue placeholder={`Select ${field.label}`} />
      </SelectTrigger>

      <SelectContent>
        {options.map(([value, label], index) => (
          <SelectItem key={`${value}-${index}`} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
