"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FinancialSummary, upsertFinancialSummary } from "@/app/actions/properties";

interface FinancialSummaryComponentProps {
  propertyId: string;
  financialSummary: FinancialSummary | null;
  propertyIncome?: number;
  propertyExpenses?: number;
}

export function FinancialSummaryComponent({
  propertyId,
  financialSummary,
  propertyIncome = 0,
  propertyExpenses = 0
}: FinancialSummaryComponentProps) {
  // Use existing data or create defaults
  const initialData = financialSummary || {
    id: '',
    property_id: propertyId,
    net_monthly_income: propertyIncome - propertyExpenses,
    profit_margin: propertyIncome > 0 ? ((propertyIncome - propertyExpenses) / propertyIncome) * 100 : 0,
    monthly_income: propertyIncome,
    monthly_expenses: propertyExpenses
  };

  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value ? parseFloat(value) : 0;
    
    if (name === 'monthly_income' || name === 'monthly_expenses') {
      const newIncome = name === 'monthly_income' ? numValue : data.monthly_income;
      const newExpenses = name === 'monthly_expenses' ? numValue : data.monthly_expenses;
      const newNetIncome = newIncome - newExpenses;
      const newProfitMargin = newIncome > 0 ? (newNetIncome / newIncome) * 100 : 0;
      
      setData({
        ...data,
        [name]: numValue,
        net_monthly_income: newNetIncome,
        profit_margin: newProfitMargin
      });
    } else {
      setData({
        ...data,
        [name]: numValue
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const summaryData = {
        ...data,
        id: data.id || crypto.randomUUID(), // Generate new ID if not exists
        property_id: propertyId
      };
      
      const result = await upsertFinancialSummary(summaryData);
      if (result) {
        toast.success("Financial summary updated successfully");
        setIsEditing(false);
        setData(result);
      } else {
        toast.error("Failed to update financial summary");
      }
    } catch (error) {
      console.error("Error saving financial summary:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setData(initialData);
    setIsEditing(false);
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${Math.round(value)}%`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Financial Summary</h3>
        {isEditing ? (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Monthly Income</div>
            {isEditing ? (
              <Input 
                type="number" 
                name="monthly_income"
                value={data.monthly_income || 0}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.monthly_income)}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Monthly Expenses</div>
            {isEditing ? (
              <Input 
                type="number" 
                name="monthly_expenses"
                value={data.monthly_expenses || 0}
                onChange={handleChange}
                className="mt-1"
              />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(data.monthly_expenses)}
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Net Monthly Income</div>
            <div className="text-lg font-bold">
              {formatCurrency(data.net_monthly_income)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Profit Margin</div>
            <div className="text-lg font-bold">
              {formatPercentage(data.profit_margin)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
