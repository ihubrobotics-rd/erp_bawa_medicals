"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PermissionGuard } from "@/components/ui/permission-guard"
import { EmployeeForm } from "@/components/forms/employee-form"
import { FormModal } from "@/components/modals/form-modal"
import { DataTable } from "@/components/tables/data-table"
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from "@/services/queries/employees"
import type { EmployeeFormData } from "@/utils/validation"
import type { Employee } from "@/types/entities"
import { UserRole } from "@/types/roles"
import { Plus, UserCheck, Edit, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatCurrency, formatDate } from "@/utils/formatters"
import { useToast } from "@/hooks/use-toast"

export default function EmployeesPage() {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const { data: employees = [], isLoading, error } = useEmployees()
  const createEmployeeMutation = useCreateEmployee()
  const updateEmployeeMutation = useUpdateEmployee()
  const deleteEmployeeMutation = useDeleteEmployee()

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => formatCurrency(row.getValue("salary")),
    },
    {
      accessorKey: "hireDate",
      header: "Hire Date",
      cell: ({ row }) => formatDate(row.getValue("hireDate")),
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
        <PermissionGuard roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingEmployee(row.original)
                setIsModalOpen(true)
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              disabled={deleteEmployeeMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </PermissionGuard>
      ),
    },
  ]

  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      if (editingEmployee) {
        await updateEmployeeMutation.mutateAsync({ id: editingEmployee.id, data })
        toast({
          title: "Success",
          description: "Employee updated successfully",
        })
      } else {
        await createEmployeeMutation.mutateAsync(data)
        toast({
          title: "Success",
          description: "Employee created successfully",
        })
      }
      setIsModalOpen(false)
      setEditingEmployee(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save employee",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployeeMutation.mutateAsync(id)
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardLayout>
      <PermissionGuard
        roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}
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
              <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
              <p className="text-muted-foreground">Manage company employees</p>
            </div>
            <PermissionGuard roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </PermissionGuard>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="mr-2 h-5 w-5" />
                Employee Management
              </CardTitle>
              <CardDescription>View and manage all company employees</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <p className="text-muted-foreground">Failed to load employees. Please try again.</p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Loading employees...</div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={employees}
                  searchKey="name"
                  searchPlaceholder="Search employees..."
                />
              )}
            </CardContent>
          </Card>

          <FormModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setEditingEmployee(null)
            }}
            title={editingEmployee ? "Edit Employee" : "Create New Employee"}
          >
            <EmployeeForm
              initialData={editingEmployee || undefined}
              onSubmit={handleSubmit}
              isLoading={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}
              mode={editingEmployee ? "edit" : "create"}
            />
          </FormModal>
        </div>
      </PermissionGuard>
    </DashboardLayout>
  )
}
