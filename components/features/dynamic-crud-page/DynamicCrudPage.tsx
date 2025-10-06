'use client'; // This component now uses state and event handlers, so it must be a client component.

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // 1. Import the Dialog components

import { DynamicTable } from './DynamicTable';
import { DynamicForm } from './DynamicForm'; 

export function DynamicCrudPage({ schema }: { schema: any }) {
  // --- Data Transformation (no changes here) ---
  const privileges = schema.role_privileges[0];
  const pageTitle = schema.submodules[0].name;
  const apiRoutes = schema.submodules[0].api_routes;
  const formSchema = schema.function_definitions;

  const tableColumns = formSchema.map((field: any) => ({
    accessorKey: field.input_name,
    header: field.label,
  }));
  
  // 2. This state will now control the Dialog's visibility
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold capitalize">{pageTitle} Management</h1>
        {privileges.can_add && (
          <Button onClick={() => setIsFormOpen(true)}>Add New {pageTitle}</Button>
        )}
      </div>

      <DynamicTable
        columns={tableColumns}
        apiGetAllRoute={apiRoutes.get_all}
        apiDeleteRoute={apiRoutes.delete}
        privileges={privileges}
      />

      {/* 3. This is the implementation of the modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="capitalize">Add New {pageTitle}</DialogTitle>
            <DialogDescription>
              Fill out the form below to create a new {pageTitle}.
            </DialogDescription>
          </DialogHeader>
          
          {/* We place the DynamicForm inside the modal content */}
          <div className="py-4">
             <DynamicForm
                schema={formSchema}
                apiCreateRoute={apiRoutes.create}
                apiGetAllRoute={apiRoutes.get_all} // Pass this to the form for cache invalidation
                onClose={() => setIsFormOpen(false)} // Pass a function to close the modal from the form
             />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}