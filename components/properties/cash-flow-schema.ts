import * as z from "zod";
import { TRANSACTION_TYPES } from "./transaction-types";

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
  amount: z.coerce.number().positive("Amount must be a positive number"),
  debit_credit: z.enum(["DEBIT", "CREDIT"], {
    required_error: "Type is required",
  }),
});

// Schema for EditCashFlowForm (similar but for editing)
export const editCashFlowSchema = cashFlowSchema;

export type CashFlowFormValues = z.infer<typeof cashFlowSchema>;
export type EditCashFlowFormValues = z.infer<typeof editCashFlowSchema>;
