'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaintenanceSchedule } from '@/app/actions/properties';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  onSubmit: (maintenanceData: MaintenanceSchedule) => Promise<void>;
  maintenance?: MaintenanceSchedule | null;
  mode?: 'view' | 'edit' | 'create';
}

export function MaintenanceModal({ 
  isOpen, 
  onClose, 
  propertyId, 
  onSubmit,
  maintenance,
  mode = 'create'
}: MaintenanceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isViewMode = mode === 'view';

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      
      const data = {
        id: maintenance?.id || '', // This will be set by the server if new
        property_id: propertyId,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        cost: parseFloat(formData.get('cost') as string),
        scheduled_date: formData.get('scheduled_date') as string,
        status: formData.get('status') as string || 'scheduled',
        assigned_to: formData.get('assigned_to') as string,
        notes: formData.get('notes') as string,
        created_at: maintenance?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as MaintenanceSchedule;

      await onSubmit(data);
    } catch (error) {
      console.error('Error in maintenance form:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'view' ? 'Maintenance Details' :
             mode === 'edit' ? 'Edit Maintenance Item' :
             'Add New Maintenance Item'}
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={maintenance?.title || ''}
              placeholder="Enter maintenance title"
              disabled={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              defaultValue={maintenance?.description || ''}
              placeholder="Enter description"
              disabled={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="scheduled_date" className="text-sm font-medium">
              Scheduled Date
            </label>
            <Input
              id="scheduled_date"
              name="scheduled_date"
              type="date"
              required
              defaultValue={maintenance?.scheduled_date ? new Date(maintenance.scheduled_date).toISOString().split('T')[0] : ''}
              disabled={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="cost" className="text-sm font-medium">
              Cost
            </label>
            <Input
              id="cost"
              name="cost"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={maintenance?.cost || ''}
              placeholder="Enter cost"
              disabled={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select name="status" defaultValue={maintenance?.status || "scheduled"} disabled={isViewMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="assigned_to" className="text-sm font-medium">
              Assigned To
            </label>
            <Input
              id="assigned_to"
              name="assigned_to"
              type="text"
              defaultValue={maintenance?.assigned_to || ''}
              placeholder="Enter assignee name"
              disabled={isViewMode}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={maintenance?.notes || ''}
              placeholder="Enter any additional notes"
              disabled={isViewMode}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Maintenance'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 