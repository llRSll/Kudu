export interface Property {
  id: string;
  name?: string;
  entity_id?: string;
  userId?: string;
  investmentId?: string;
  streetNumber?: string;
  streetName?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
  landPrice?: number;
  buildPrice?: number;
  purchaseDate?: string;
  currentValuation?: number;
  lastValuationDate?: Date;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  hasPool?: boolean;
  monthlyIncome?: number;
  propertyPurchasePrice?: number;
  type?: string;
  amenities?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  location?: string;
  value?: number;
  income?: number;
  expenses?: number;
  occupancy?: number;
  status?: string;
  image?: string;
  yearBuilt?: number;
  unit?: string | number;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  hasSecuritySystem?: boolean;
  petsAllowed?: boolean;
  furnished?: boolean;
  hasSolar?: boolean;
  lotSize?: number;
  numUnits?: number;
  numFloors?: number;
  hasParkingGarage?: boolean;
  hasElevator?: boolean;
  privateNotes?: string;
}

export type StatusBadgeVariant =
  | "outline"
  | "secondary"
  | "default"
  | "destructive";

export interface StatusBadge {
  variant: StatusBadgeVariant;
  text: string;
}

export interface ExtendedPropertyData {
  // Basic info
  name: string;
  type: string;
  status:
    | "active"
    | "prospect"
    | "under-contract"
    | "in-development"
    | "for-sale"
    | "pending-sale"
    | "archived";
  description: string;

  // Location
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  stateLabel?: string; // For display purposes
  postalCode: string;
  country: string;
  countryLabel?: string; // For display purposes

  // Details
  area: number;
  yearBuilt: number;
  bedrooms: number;
  bathrooms: number;
  lotSize: number;
  numUnits: number;
  numFloors: number;
  parking: number;

  // Financial
  currentValuation: number;
  buildPrice: number;
  purchaseDate: string;
  landPrice: number;
  hasExistingStructure: boolean;

  // Additional
  hasPool: boolean;
  hasParkingGarage: boolean;
  hasElevator: boolean;
  hasSecuritySystem: boolean;
  petsAllowed: boolean;
  furnished: boolean;
  hasSolar: boolean;

  // Notes
  privateNotes: string;
}

export interface AddPropertyFormProps {
  onAddProperty: (property: Property) => void;
}
