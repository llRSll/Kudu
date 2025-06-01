import { Property } from "@/app/actions/properties";

// Types
export interface AddCashFlowFormProps {
  property: Property;
  onSuccess: () => void;
}

export interface TransactionType {
  value: string;
  label: string;
  defaultType: "debit" | "credit";
}
