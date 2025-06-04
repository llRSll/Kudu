"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth-context";
import toast from "react-hot-toast";
import { updateCashFlow, getCashFlowById } from "@/app/actions/cashflows";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@/app/actions/properties";
import { editCashFlowSchema, EditCashFlowFormValues } from "./cash-flow-schema";
import { TRANSACTION_TYPES } from "./transaction-types";
import { MAINTENANCE_TYPES } from "./maintenance-types";
import { CashFlow } from "@/app/actions/cashflows";

interface EditCashFlowFormProps {
  property: Property;
  cashFlowId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditCashFlowForm({
  property,
  cashFlowId,
  onSuccess,
  onCancel,
}: EditCashFlowFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<EditCashFlowFormValues>({
    resolver: zodResolver(editCashFlowSchema),
    mode: "onChange", // Validate on change for immediate feedback
    defaultValues: {
      timestamp: new Date(),
      description: "",
      transaction_type: "",
      income: 0,
      maintenance_cost: 0,
      expenses: 0,
      debit_credit: "CREDIT",
      maintenance_type: "",
    },
  });

  // Load existing cash flow data
  useEffect(() => {
    const loadCashFlow = async () => {
      setIsLoading(true);
      try {
        const result = await getCashFlowById(cashFlowId);
        if (result.success && result.data) {
          const cashFlow = result.data;
          form.reset({
            timestamp: new Date(cashFlow.timestamp),
            description: cashFlow.description,
            transaction_type: cashFlow.transaction_type,
            income: cashFlow.income || 0,
            maintenance_cost: cashFlow.maintenance || 0,
            expenses: cashFlow.expenses || 0,
            debit_credit: cashFlow.debit_credit,
            maintenance_type: cashFlow.maintenance_type || "",
          });
        } else {
          toast.error(result.error || "Failed to load cash flow data");
          onCancel();
        }
      } catch (error) {
        console.error("Error loading cash flow:", error);
        toast.error("Failed to load cash flow data");
        onCancel();
      } finally {
        setIsLoading(false);
      }
    };

    loadCashFlow();
  }, [cashFlowId, form, onCancel]);

  // Helper function to update debit_credit type when transaction_type changes
  const handleTransactionTypeChange = (type: string) => {
    const selectedType = TRANSACTION_TYPES.find((t) => t.value === type);
    if (selectedType) {
      // Set debit_credit based on the transaction type
      const debitCredit = selectedType.defaultType as "DEBIT" | "CREDIT";
      form.setValue("debit_credit", debitCredit);

      // Reset amount fields based on type
      if (debitCredit === "CREDIT") {
        form.setValue("maintenance_cost", 0);
        form.setValue("expenses", 0);
      } else if (["MAINTENANCE", "REPAIR", "REPAIRS"].includes(type)) {
        form.setValue("income", 0);
        form.setValue("expenses", 0);
      } else {
        form.setValue("income", 0);
        form.setValue("maintenance_cost", 0);
      }
    }
    form.setValue("transaction_type", type);
  };

  async function onSubmit(values: EditCashFlowFormValues) {
    if (!user) {
      toast.error("You must be logged in to update a cash flow");
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the timestamp with full date and time
      const formattedTimestamp = format(
        values.timestamp,
        "yyyy-MM-dd'T'HH:mm:ss"
      );

      const updates = {
        property_id: property.id,
        user_id: user.id,
        entity_id: property.entity_id || null,
        investment_id: property.investment_id || null,
        timestamp: formattedTimestamp,
        description: values.description,
        transaction_type: values.transaction_type,
        debit_credit: values.debit_credit,
        maintenance_type: values.maintenance_type || null,
        income: values.income,
        expenses: values.expenses,
        maintenance: values.maintenance_cost,
      };

      const result = await updateCashFlow(cashFlowId, updates);

      if (result.success && result.data) {
        toast.success("Cash flow updated successfully");
        onSuccess();
      } else {
        throw new Error(result.error || "Failed to update cash flow");
      }
    } catch (error) {
      console.error("Error updating cash flow:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update cash flow. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 min-h-[500px]">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="mt-2 text-sm text-muted-foreground">
            Loading cash flow data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="timestamp"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <div className="flex flex-col gap-2">
                <div className="grid w-full items-center gap-1.5">
                  <FormControl>
                    <Input
                      type="date"
                      className={cn("w-full", {
                        "border-red-500 focus-visible:ring-red-500":
                          form.formState.errors.timestamp,
                      })}
                      onChange={(e) => {
                        // Set time to 00:00:00 for selected date
                        const date = new Date(e.target.value);
                        date.setHours(0, 0, 0, 0);
                        field.onChange(date);
                      }}
                      value={
                        field.value instanceof Date &&
                        !isNaN(field.value.getTime())
                          ? format(field.value, "yyyy-MM-dd")
                          : ""
                      }
                    />
                  </FormControl>
                </div>
              </div>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="income"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Income Amount ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={cn({
                      "border-red-500 focus-visible:ring-red-500":
                        form.formState.errors.income,
                    })}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="debit_credit"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn({
                        "border-red-500 focus-visible:ring-red-500":
                          form.formState.errors.debit_credit,
                      })}
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CREDIT">Credit</SelectItem>
                    <SelectItem value="DEBIT">Debit</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-4">
          <FormField
            control={form.control}
            name="expenses"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Expense Amount ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={cn({
                      "border-red-500 focus-visible:ring-red-500":
                        form.formState.errors.expenses,
                    })}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenance_cost"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Maintenance Cost ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className={cn({
                      "border-red-500 focus-visible:ring-red-500":
                        form.formState.errors.maintenance_cost,
                    })}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="transaction_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select
                onValueChange={(value) => handleTransactionTypeChange(value)}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn({
                      "border-red-500 focus-visible:ring-red-500":
                        form.formState.errors.transaction_type,
                    })}
                  >
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed description of the cash flow"
                  className={cn({
                    "border-red-500 focus-visible:ring-red-500":
                      form.formState.errors.description,
                  })}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-1" />
            </FormItem>
          )}
        />
        
        {/* Show maintenance type selection only for maintenance-related transaction types */}
        {["MAINTENANCE", "REPAIR", "REPAIRS"].includes(
          form.watch("transaction_type")
        ) && (
          <FormField
            control={form.control}
            name="maintenance_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn({
                        "border-red-500 focus-visible:ring-red-500":
                          form.formState.errors.maintenance_type,
                      })}
                    >
                      <SelectValue placeholder="Select maintenance type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MAINTENANCE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500 text-sm mt-1" />
              </FormItem>
            )}
          />
        )}

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Cash Flow"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
