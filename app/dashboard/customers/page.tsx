"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PermissionGuard } from "@/components/ui/permission-guard"
import { CustomerForm } from "@/components/forms/customer-form"
import { FormModal } from "@/components/modals/form-modal"
import { DataTable } from "@/components/tables/data-table"
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from "@/services/queries/customers"
import type { CustomerFormData } from "@/utils/validation"
import type { Customer } from "@/types/entities"
import { UserRole } from "@/types/roles"
import { Plus, Building2, Edit, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDate, formatPhoneNumber } from "@/utils/formatters"
import { useToast } from "@/hooks/use-toast"

export default function CustomersPage() {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const { data: customers = [], isLoading, error } = useCustomers()
  const createCustomerMutation = useCreateCustomer()
  const updateCustomerMutation = useUpdateCustomer()
  const deleteCustomerMutation = useDeleteCustomer()

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => formatPhoneNumber(row.getValue("phone")),
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => row.getValue("company") || "—",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => formatDate(row.getValue("createdAt")),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.getValue("isActive") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {row.getValue("isActive") ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <PermissionGuard roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES]}>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingCustomer(row.original)
                setIsModalOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              disabled={deleteCustomerMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </PermissionGuard>
      ),
    },
  ]

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      if (editingCustomer) {
        await updateCustomerMutation.mutateAsync({ id: editingCustomer.id, data })
        toast({
          title: "Success",
          description: "Customer updated successfully",
        })
      } else {
        await createCustomerMutation.mutateAsync(data)
        toast({
          title: "Success",
          description: "Customer created successfully",
        })
      }
      setIsModalOpen(false)
      setEditingCustomer(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customer",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomerMutation.mutateAsync(id)
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <PermissionGuard
        roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES]}
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to view this page.</p>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
              <p className="text-muted-foreground">Manage customer relationships</p>
            </div>
            <PermissionGuard roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES]}>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </PermissionGuard>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Customer Management
              </CardTitle>
              <CardDescription>View and manage all customers</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <p className="text-muted-foreground">Failed to load customers. Please try again.</p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Loading customers...</div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={customers}
                  searchKey="name"
                  searchPlaceholder="Search customers..."
                />
              )}
            </CardContent>
          </Card>

          <FormModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setEditingCustomer(null)
            }}
            title={editingCustomer ? "Edit Customer" : "Create New Customer"}
          >
            <CustomerForm
              initialData={editingCustomer || undefined}
              onSubmit={handleSubmit}
              isLoading={createCustomerMutation.isPending || updateCustomerMutation.isPending}
              mode={editingCustomer ? "edit" : "create"}
            />
          </FormModal>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  )
}
