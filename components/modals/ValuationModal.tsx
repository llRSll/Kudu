'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Valuation } from '@/app/actions/properties';

interface ValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  onSubmit: (valuationData: Valuation) => Promise<void>;
  valuation?: Valuation | null;
}

export function ValuationModal({ 
  isOpen, 
  onClose, 
  propertyId, 
  onSubmit,
  valuation 
}: ValuationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      
      const data = {
        id: valuation?.id || '', // This will be set by the server if new
        property_id: propertyId,
        appraised_value: parseFloat(formData.get('appraised_value') as string),
        appraised_date: formData.get('appraised_date') as string,
        appraised_by: formData.get('appraised_by') as string,
        notes: formData.get('notes') as string,
        created_at: valuation?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Valuation;

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error in valuation form:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{valuation ? 'Edit Valuation' : 'Add New Valuation'}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="appraised_value" className="text-sm font-medium">
              Appraised Value
            </label>
            <Input
              id="appraised_value"
              name="appraised_value"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={valuation?.appraised_value || ''}
              placeholder="Enter appraised value"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="appraised_date" className="text-sm font-medium">
              Appraisal Date
            </label>
            <Input
              id="appraised_date"
              name="appraised_date"
              type="date"
              required
              defaultValue={valuation?.appraised_date ? new Date(valuation.appraised_date).toISOString().split('T')[0] : ''}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="appraised_by" className="text-sm font-medium">
              Appraised By
            </label>
            <Input
              id="appraised_by"
              name="appraised_by"
              type="text"
              required
              defaultValue={valuation?.appraised_by || ''}
              placeholder="Enter appraiser name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={valuation?.notes || ''}
              placeholder="Enter any additional notes"
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
              {isLoading ? (valuation ? 'Updating...' : 'Adding...') : (valuation ? 'Update Valuation' : 'Add Valuation')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 