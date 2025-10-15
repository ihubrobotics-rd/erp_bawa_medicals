import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;


export const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  salary: z.number().min(0, "Salary must be a positive number"),
  hireDate: z.string().min(1, "Hire date is required"),
  isActive: z.boolean().default(true),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;


export const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  isActive: z.boolean().default(true),
});

export type CustomerFormData = z.infer<typeof customerSchema>;


export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().min(0, "Quantity must be positive"),
  category: z.string().min(1, "Category is required"),
  isActive: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;

