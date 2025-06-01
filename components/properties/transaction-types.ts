// Available transaction types with their default debit/credit status
export const TRANSACTION_TYPES = [
  { value: "RENT", label: "Rent", defaultType: "credit" },
  { value: "REPAIR", label: "Repair", defaultType: "debit" },
  { value: "REPAIRS", label: "Repairs", defaultType: "debit" },
  { value: "MORTGAGE", label: "Mortgage", defaultType: "debit" },
  { value: "MAINTENANCE", label: "Maintenance", defaultType: "debit" },
  { value: "UTILITIES", label: "Utilities", defaultType: "debit" },
  { value: "TAXES", label: "Property Taxes", defaultType: "debit" },
  { value: "INSURANCE", label: "Insurance", defaultType: "debit" },
  { value: "MANAGEMENT", label: "Property Management", defaultType: "debit" },
  { value: "CLEANING", label: "Cleaning Services", defaultType: "debit" },
  { value: "OTHER", label: "Other", defaultType: "debit" },
];
