'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { upsertFinancialDetails } from '@/app/actions/financials';
import { toast } from 'sonner';
import { FinancialDetails } from '@/app/actions/properties';

interface FinancialDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  currentDetails?: FinancialDetails | null;
}

export function FinancialDetailsModal({ 
  isOpen, 
  onClose, 
  propertyId,
  currentDetails 
}: FinancialDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      
      const propertyValue = parseFloat(formData.get('property_value') as string);
      const annualIncome = parseFloat(formData.get('annual_income') as string);
      const annualExpenses = parseFloat(formData.get('annual_expenses') as string);

      // Validate field limits
      if (propertyValue >= 10000000000) { // 10 digits (DECIMAL(12,2))
        throw new Error('Property value must be less than 10 billion');
      }
      if (annualIncome >= 100000000) { // 8 digits (DECIMAL(10,2))
        throw new Error('Annual income must be less than 100 million');
      }
      if (annualExpenses >= 100000000) { // 8 digits (DECIMAL(10,2))
        throw new Error('Annual expenses must be less than 100 million');
      }

      const data = {
        property_id: propertyId,
        property_value: propertyValue,
        annual_income: annualIncome,
        annual_expenses: annualExpenses,
      };

      await upsertFinancialDetails(data);
      toast.success('Financial details updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating financial details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update financial details');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentDetails ? 'Update Financial Details' : 'Add Financial Details'}
          </DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="property_value" className="text-sm font-medium">
              Property Value
            </label>
            <Input
              id="property_value"
              name="property_value"
              type="number"
              step="0.01"
              min="0"
              max="9999999999.99"
              required
              defaultValue={currentDetails?.property_value || ''}
              placeholder="Enter property value (max: 9,999,999,999.99)"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="annual_income" className="text-sm font-medium">
              Annual Income
            </label>
            <Input
              id="annual_income"
              name="annual_income"
              type="number"
              step="0.01"
              min="0"
              max="99999999.99"
              required
              defaultValue={currentDetails?.annual_income || ''}
              placeholder="Enter annual income (max: 99,999,999.99)"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="annual_expenses" className="text-sm font-medium">
              Annual Expenses
            </label>
            <Input
              id="annual_expenses"
              name="annual_expenses"
              type="number"
              step="0.01"
              min="0"
              max="99999999.99"
              required
              defaultValue={currentDetails?.annual_expenses || ''}
              placeholder="Enter annual expenses (max: 99,999,999.99)"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : currentDetails ? 'Save Changes' : 'Add Details'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 