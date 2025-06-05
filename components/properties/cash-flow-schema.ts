import * as z from "zod";
import { TRANSACTION_TYPES } from "./transaction-types";
import { MAINTENANCE_TYPES } from "./maintenance-types";

// Schema for AddCashFlowForm
export const cashFlowSchema = z.object({
  timestamp: z.date({
    required_error: "Date is required",
  }),
  description: z.string().min(3, "Description must be at least 3 characters"),
  transaction_type: z.string({
    required_error: "Transaction type is required"
  }).refine((val) => {
    return TRANSACTION_TYPES.some((type) => type.value === val);
  }, {
    message: "Please select a valid transaction type"
  }),
  income: z.coerce.number().nonnegative("Income must be zero or positive"),
  maintenance_cost: z.coerce.number().nonnegative("Maintenance cost must be zero or positive"),
  expenses: z.coerce.number().nonnegative("Expenses must be zero or positive"),
  // amount: z.coerce.number().positive("Amount must be a positive number"),
  debit_credit: z.enum(["DEBIT", "CREDIT"], {
    required_error: "Type is required",
  }),
  maintenance_type: z.string().optional().refine(
    (val) => {
      return !val || MAINTENANCE_TYPES.some((type) => type.value === val);
    },
    {
      message: "Please select a valid maintenance type"
    }
  ),
});

// Schema for EditCashFlowForm (similar but for editing)
export const editCashFlowSchema = cashFlowSchema;

export type CashFlowFormValues = z.infer<typeof cashFlowSchema>;
export type EditCashFlowFormValues = z.infer<typeof editCashFlowSchema>;
