// Available transaction types with their default debit/credit status
export const TRANSACTION_TYPES = [
  { value: "RENT", label: "Rent", defaultType: "CREDIT" },
  { value: "REPAIR", label: "Repair", defaultType: "DEBIT" },
  { value: "REPAIRS", label: "Repairs", defaultType: "DEBIT" },
  { value: "MORTGAGE", label: "Mortgage", defaultType: "DEBIT" },
  { value: "MAINTENANCE", label: "Maintenance", defaultType: "DEBIT" },
  { value: "UTILITIES", label: "Utilities", defaultType: "DEBIT" },
  { value: "TAXES", label: "Property Taxes", defaultType: "DEBIT" },
  { value: "INSURANCE", label: "Insurance", defaultType: "DEBIT" },
  { value: "MANAGEMENT", label: "Property Management", defaultType: "DEBIT" },
  { value: "CLEANING", label: "Cleaning Services", defaultType: "DEBIT" },
  { value: "OTHER", label: "Other", defaultType: "DEBIT" },
];
