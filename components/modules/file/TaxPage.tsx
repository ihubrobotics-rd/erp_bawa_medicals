"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { useTaxes } from '@/hooks/file/useTaxes';
import { TaxTable } from './TaxTable';
import { TaxForm } from './TaxForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type ModalState = {
  open: boolean;
  mode: 'add' | 'edit';
  currentTax: any | null;
};

export default function TaxPage({ privileges }: { privileges: any }) {
  const { getTaxesQuery, createTaxMutation, updateTaxMutation, deleteTaxMutation } = useTaxes();
  const [modalState, setModalState] = useState<ModalState>({ open: false, mode: 'add', currentTax: null });

  const handleOpenAddModal = () => setModalState({ open: true, mode: 'add', currentTax: null });
  const handleOpenEditModal = (tax: any) => setModalState({ open: true, mode: 'edit', currentTax: tax });
  const closeModal = () => setModalState({ ...modalState, open: false });

  const handleDelete = (id: number) => {
    toast.warning('Are you sure you want to delete this tax?', {
      action: {
        label: 'Confirm',
        onClick: () => deleteTaxMutation.mutate(id),
      },
      duration: 5000,
    });
  };

  const handleFormSubmit = (data: any) => {
    if (modalState.mode === 'add') {
      createTaxMutation.mutate(data, { onSuccess: closeModal });
    } else {
      updateTaxMutation.mutate({ id: modalState.currentTax.id, data }, { onSuccess: closeModal });
    }
  };

  // Use results array from API
  const taxes = getTaxesQuery.data?.data?.results || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tax Management</h1>
        {privileges.can_add && <Button onClick={handleOpenAddModal}>Add New Tax</Button>}
      </div>

      {getTaxesQuery.isLoading && <p>Loading tax data...</p>}
      {getTaxesQuery.isError && <p className="text-red-500">Error: {getTaxesQuery.error?.message}</p>}

      {privileges.can_view && (
        <TaxTable
          data={taxes}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          canEdit={privileges.can_edit}
          canDelete={privileges.can_delete}
        />
      )}

      <Dialog open={modalState.open} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{modalState.mode === 'add' ? 'Create a New Tax' : 'Edit Tax'}</DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>
          <TaxForm
            onSubmit={handleFormSubmit}
            initialData={modalState.currentTax}
            isSubmitting={createTaxMutation.isPending || updateTaxMutation.isPending}
            onCancel={closeModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
