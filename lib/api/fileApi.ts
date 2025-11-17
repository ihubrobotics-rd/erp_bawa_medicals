import type { Tax } from "@/types/medical"
import type { TaxFormValues } from "@/lib/zod-schemas/taxSchema"

let taxes: Tax[] = [
  {
    id: 1,
    name: "GST",
    rate: 18,
    isActive: true,
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Service Tax",
    rate: 12,
    isActive: false,
    createdAt: "2024-02-15T00:00:00.000Z",
  },
]

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

export const getTaxes = async (): Promise<Tax[]> => {
  await delay()
  return taxes
}

export const createTax = async (data: TaxFormValues): Promise<Tax> => {
  await delay()
  const newTax: Tax = {
    id: Date.now(),
    name: data.name,
    rate: data.rate,
    isActive: data.isActive,
    createdAt: new Date().toISOString(),
  }
  taxes = [newTax, ...taxes]
  return newTax
}

export const updateTax = async ({
  id,
  data,
}: {
  id: number
  data: TaxFormValues
}): Promise<Tax> => {
  await delay()
  taxes = taxes.map((tax) =>
    tax.id === id ? { ...tax, ...data, createdAt: tax.createdAt } : tax,
  )
  const updated = taxes.find((tax) => tax.id === id)
  if (!updated) {
    throw new Error("Tax not found")
  }
  return updated
}

export const deleteTax = async (id: number): Promise<void> => {
  await delay()
  taxes = taxes.filter((tax) => tax.id !== id)
}

