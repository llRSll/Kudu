"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { addCashFlow } from "@/app/actions/cashflows";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AddCashFlowFormProps } from "./cash-flow-types";
import { cashFlowSchema, CashFlowFormValues } from "./cash-flow-schema";
import { TRANSACTION_TYPES } from "./transaction-types";



export function AddCashFlowForm({ property, onSuccess }: AddCashFlowFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Use current date and time
  const currentDateTime = new Date();
  
  const form = useForm<CashFlowFormValues>({
    resolver: zodResolver(cashFlowSchema),
    defaultValues: {
      timestamp: currentDateTime,
      description: "",
      transaction_type: "",
      amount: undefined,
      debit_credit: "credit", // Default to credit (income)
    },
  });
  
  // Helper function to update debit_credit type when transaction_type changes
  const handleTransactionTypeChange = (type: string) => {
    const selectedType = TRANSACTION_TYPES.find(t => t.value === type);
    if (selectedType) {
      form.setValue("debit_credit", selectedType.defaultType as "debit" | "credit");
    }
    form.setValue("transaction_type", type);
  };

  async function onSubmit(values: CashFlowFormValues) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add a cash flow",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the timestamp with full date and time
      const formattedTimestamp = format(values.timestamp, "yyyy-MM-dd'T'HH:mm:ss");
      
      const cashFlowData = {
        property_id: property.id,
        user_id: user.id,
        entity_id: property.entity_id || null,
        investment_id: property.investment_id || null,
        timestamp: formattedTimestamp,
        // Remove date field as it's not in the schema anymore
        description: values.description,
        transaction_type: values.transaction_type,
        amount: values.amount,
        debit_credit: values.debit_credit,
        // Set the statuses based on debit_credit value
        type: (values.debit_credit === 'credit' ? 'income' : 'expense') as 'income' | 'expense',
        status: 'completed' as 'scheduled' | 'pending' | 'completed', // Default status
      };
      
      // Log the payload before sending
      console.log('Cash flow data being sent to server:', cashFlowData);
      
      const result = await addCashFlow(cashFlowData);
      
      if (result) {
        toast({
          title: "Success",
          description: "Cash flow entry added successfully",
        });
        form.reset();
        onSuccess();
      } else {
        throw new Error("Failed to add cash flow. Server returned no data.");
      }
    } catch (error) {
      console.error("Error adding cash flow:", error);
      let errorMessage = "Failed to add cash flow. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="timestamp"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date & Time</FormLabel>
              <div className="flex flex-col gap-2">
                <div className="grid w-full items-center gap-1.5">
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="w-full"
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        field.onChange(date);
                      }}
                      value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ""}
                    />
                  </FormControl>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="transaction_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select 
                onValueChange={(value) => handleTransactionTypeChange(value)} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
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
              <FormMessage />
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
                <Textarea placeholder="Detailed description of the cash flow" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="debit_credit"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="credit">Income (Credit)</SelectItem>
                    <SelectItem value="debit">Expense (Debit)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Amount ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Cash Flow"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
