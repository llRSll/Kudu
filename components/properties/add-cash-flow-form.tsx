"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Property } from "@/app/actions/properties";
import { addCashFlow } from "@/app/actions/cashflows";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { DialogFooter } from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Schema for AddCashFlowForm
const cashFlowSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  description: z.string().min(3, "Description must be at least 3 characters"),
  type: z.enum(["income", "expense"], {
    required_error: "Type is required",
  }),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  status: z.enum(["scheduled", "pending", "completed"], {
    required_error: "Status is required",
  }),
});

export type CashFlowFormValues = z.infer<typeof cashFlowSchema>;

interface AddCashFlowFormProps {
  property: Property;
  onSuccess: () => void;
}

export function AddCashFlowForm({ property, onSuccess }: AddCashFlowFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<CashFlowFormValues>({
    resolver: zodResolver(cashFlowSchema),
    defaultValues: {
      date: undefined,
      description: "",
      type: "income",
      amount: undefined,
      status: "completed",
    },
  });

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
      const cashFlowData = {
        property_id: property.id,
        user_id: user.id,
        entity_id: property.entity_id || null,
        date: format(values.date, "yyyy-MM-dd"),
        description: values.description,
        type: values.type,
        amount: values.amount,
        status: values.status,
      };
      
      const result = await addCashFlow(cashFlowData);
      
      if (result) {
        toast({
          title: "Success",
          description: "Cash flow entry added successfully",
        });
        form.reset();
        onSuccess();
      } else {
        throw new Error("Failed to add cash flow");
      }
    } catch (error) {
      console.error("Error adding cash flow:", error);
      toast({
        title: "Error",
        description: "Failed to add cash flow. Please try again.",
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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                <Input placeholder="Description of the cash flow" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="type"
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
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
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
        
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Cash Flow"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
