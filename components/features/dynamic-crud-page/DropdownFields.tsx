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

const getOptionLabel = (option, field) => {
  const specificNameKey = `${field.input_name}_name`;
  if (option[specificNameKey]) {
    return option[specificNameKey];
  }
  const fallbackKeys = ['name', 'label', 'title', 'state_name', 'country_name','designation_name','code','transport_type','currency_code','username'];
  for (const key of fallbackKeys) {
    if (option[key]) return option[key];
  }
  return `Option ${option.id}`;
};

export function DynamicDropdown({ field, schema, setValue, watch }) {
  const currentValue = watch(field.input_name);
  const isTargetField = schema.some(
    (otherField) => otherField.mapping === field.input_name
  );

  const isDisabled = isTargetField && !!currentValue;

  const { data: options, isLoading, isError } = useQuery({
    queryKey: ['dropdown-options', field.options_api],
    queryFn: async () => {
      const res = await api.get(field.options_api);
      return res.data.data?.results || [];
    },
    enabled: !!field.options_api,
  });

  const { mutate: fetchDetailsAndUpdateForm } = useMutation({
    mutationFn: async (selectedId) => {
      if (!field.detail_api || !field.mapping) return null;
      const detailUrl = field.detail_api.replace('<int:pk>', selectedId);
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

  const handleValueChange = (value) => {
    setValue(field.input_name, value);
    if (field.mapping) {
      setValue(field.mapping, null, { shouldValidate: true });
    }
    
    if (field.detail_api && field.mapping) {
      fetchDetailsAndUpdateForm(value);
    }
  };

  if (isLoading) return <p className="text-sm text-muted-foreground mt-2">Loading {field.label}...</p>;
  if (isError) return <p className="text-sm text-red-500 mt-2">Failed to load {field.label}</p>;
    if (!options.length)
        return (
          <p className="text-sm text-muted-foreground mt-2">
            No {field.label} data available
          </p>
        );
  return (
    <Select
      onValueChange={handleValueChange}
      value={currentValue ? currentValue.toString() : ''}
      disabled={isDisabled} 
    >
      <SelectTrigger className="mt-2">
        <SelectValue placeholder={`Select ${field.label}`} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((opt) => (
          <SelectItem key={opt.id} value={opt.id.toString()}>
            {getOptionLabel(opt, field)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Static dropdown component - No changes needed here, but keeping it for completeness.
export function StaticDropdown({ field, setValue, watch }) {
  const currentValue = watch(field.input_name);
  let options = [];

  try {
    const formatted = field.values
      .replace(/^\[|\]$/g, "") // remove outer brackets
      .split(/\),\s*\(/)       // split each tuple
      .map((pair) =>
        pair
          .replace(/[\[\]\(\)']/g, "") // strip symbols
          .split(",")                  // split by comma
          .map((v) => v.trim())        // trim spaces
      );
    options = formatted;
  } catch (err) {
    console.error("Failed to parse static values:", field.values, err);
  }


  return (
    <Select
      onValueChange={(value) => setValue(field.input_name, value)}
      value={currentValue ? currentValue.toString() : ""}
    >
      <SelectTrigger className="mt-2">
        <SelectValue placeholder={`Select ${field.label}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map(([value, label], index) => (
          <SelectItem key={index} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}