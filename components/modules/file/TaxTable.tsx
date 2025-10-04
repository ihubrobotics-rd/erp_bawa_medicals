import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export function TaxTable({
  data,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  return (
    <div className="border rounded-lg overflow-x-auto shadow-sm">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {[
              'Tax Code', 'Tax Mode', 'Description', 'Central Tax', 'Local Tax', 'Surcharge',
              'Tax on MRP', 'Effective %', 'Inactive', 'MRP Inclusive', 'Commodity Code', 'Cess Tax',
              'Show Tax Value', 'Applicable For', 'Cess Based On', 'Service Tax Cess Based On',
              'Tax Computation', 'Service Tax', 'ST Cess', 'ST Educess', 'Old Tax', 'Is Updated',
              'Created At'
            ].map((heading) => (
              <th
                key={heading}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
              >
                {heading}
              </th>
            ))}
            {(canEdit || canDelete) && (
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((tax, index) => (
              <tr
                key={tax.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
              >
                <td className="px-4 py-2 whitespace-nowrap">{tax.tax_code}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.tax_mode}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.description}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.central_tax}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.local_tax}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.surcharge}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.tax_on_mrp ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.effective_tax_percentage}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.inactive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.is_mrp_inclusive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.commodity_code}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.cess_tax}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.show_tax_value_at_display ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.applicable_for}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.cess_based_on}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.servtax_cess_based_on}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.tax_computation}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.service_tax}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.st_cess}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.st_educess}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.old_tax}</td>
                <td className="px-4 py-2 whitespace-nowrap">{tax.is_updated ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 whitespace-nowrap">{new Date(tax.created_at).toLocaleString()}</td>

                {(canEdit || canDelete) && (
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <div className="inline-flex gap-2">
                      {canEdit && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit(tax)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:text-red-500"
                          onClick={() => onDelete(tax.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={25} className="px-4 py-4 text-center text-gray-500">
                No tax data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
