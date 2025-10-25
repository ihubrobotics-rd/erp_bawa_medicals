"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usePermissions } from "@/hooks/usePermissions"
import { ProductForm } from "@/components/forms/product-form"
import { FormModal } from "@/components/modals/form-modal"
import { DataTable } from "@/components/tables/data-table"
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/services/queries/products"
import type { ProductFormData } from "@/utils/validation"
import type { Product } from "@/types/entities"
import { Plus, Package, Edit, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatCurrency } from "@/utils/formatters"
import { useToast } from "@/hooks/use-toast"

export default function ProductsPage() {
  const { canManageProducts } = usePermissions()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const { data: products = [], isLoading, error } = useProducts()
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()

  if (!canManageProducts()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to view this page.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => formatCurrency(row.getValue("price")),
    },
    {
      accessorKey: "stock",
      header: "Stock",
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
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingProduct(row.original)
              setIsModalOpen(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            disabled={deleteProductMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const handleSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({ id: editingProduct.id, data })
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      } else {
        await createProductMutation.mutateAsync(data)
        toast({
          title: "Success",
          description: "Product created successfully",
        })
      }
      setIsModalOpen(false)
      setEditingProduct(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id)
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Error</h2>
            <p className="text-muted-foreground">Failed to load products. Please try again.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Product Catalog
            </CardTitle>
            <CardDescription>View and manage all products</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">Loading products...</div>
              </div>
            ) : (
              <DataTable columns={columns} data={products} searchKey="name" searchPlaceholder="Search products..." />
            )}
          </CardContent>
        </Card>

        <FormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingProduct(null)
          }}
          title={editingProduct ? "Edit Product" : "Create New Product"}
        >
          <ProductForm
            initialData={editingProduct || undefined}
            onSubmit={handleSubmit}
            isLoading={createProductMutation.isPending || updateProductMutation.isPending}
            mode={editingProduct ? "edit" : "create"}
          />
        </FormModal>
      </div>
    </DashboardLayout>
  )
}
