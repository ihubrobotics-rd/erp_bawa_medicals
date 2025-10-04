// api/fileApi.ts
import api from '@/lib/api'; // Your configured axios instance from lib/api.ts
import { TaxFormValues } from '@/lib/zod-schemas/taxSchema';

const createFormData = (data: object) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
             formData.append(key, String(value));
        }
    });
    return formData;
};

// GET List of Taxes
export const getTaxes = async (): Promise<any[]> => {
  const response = await api.get('/file_module/taxes/list/');
  return response.data; 
};

// CREATE a new Tax
export const createTax = async (data: TaxFormValues): Promise<any> => {
    const formData = createFormData(data);
    const response = await api.post('/file_module/taxes/create/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// UPDATE a Tax
export const updateTax = async ({ id, data }: { id: number, data: TaxFormValues }): Promise<any> => {
    const formData = createFormData(data);
    const response = await api.put(`/file_module/taxes/update/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

// DELETE a Tax
export const deleteTax = async (id: number): Promise<any> => {
    const response = await api.delete(`/file_module/taxes/deactivate/${id}/`);
    return response.data;
};