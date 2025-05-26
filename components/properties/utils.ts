import { ExtendedPropertyData, Property, StatusBadge } from "./types";

export function getStatusBadge(status: Property["status"]): StatusBadge {
  const badges: Record<Property["status"], StatusBadge> = {
    prospect: { variant: "outline", text: "Prospect" },
    "under-contract": { variant: "secondary", text: "Under Contract" },
    active: { variant: "default", text: "Active" },
    "in-development": { variant: "secondary", text: "In Development" },
    "for-sale": { variant: "destructive", text: "For Sale" },
    "pending-sale": { variant: "outline", text: "Pending Sale" },
    archived: { variant: "outline", text: "Archived" },
  };
  return badges[status] || badges.active;
}

export const adjectives = [
  "Alpine",
  "Amber",
  "Azure",
  "Blazing",
  "Coastal",
  "Crystal",
  "Desert",
  "Diamond",
  "Emerald",
  "Golden",
  "Harbor",
  "Horizon",
  "Jade",
  "Lunar",
  "Maple",
  "Midnight",
  "Northern",
  "Oasis",
  "Pacific",
  "Phoenix",
  "Royal",
  "Ruby",
  "Sapphire",
  "Scenic",
  "Skyline",
  "Solar",
  "Summit",
  "Sunset",
  "Timber",
  "Tranquil",
  "Urban",
  "Valley",
  "Verdant",
  "Vintage",
  "Vista",
  "Willow",
];

export const nouns = [
  "Acres",
  "Arbor",
  "Boulevard",
  "Cove",
  "Crossing",
  "Domain",
  "Estates",
  "Gardens",
  "Gateway",
  "Grove",
  "Harbor",
  "Haven",
  "Heights",
  "Highlands",
  "Hills",
  "Hollow",
  "Isle",
  "Lagoon",
  "Landing",
  "Lodge",
  "Manor",
  "Meadows",
  "Mews",
  "Oaks",
  "Palms",
  "Pines",
  "Place",
  "Plaza",
  "Point",
  "Pointe",
  "Ranch",
  "Reserve",
  "Ridge",
  "Shore",
  "Springs",
  "Square",
  "Station",
  "Terrace",
  "Towers",
  "Trails",
  "Valley",
  "Views",
  "Villas",
  "Vista",
  "Woods",
];

export const defaultFormData: ExtendedPropertyData = {
  name: "",
  type: "Residential",
  status: "active" as
    | "active"
    | "prospect"
    | "under-contract"
    | "in-development"
    | "for-sale"
    | "pending-sale"
    | "archived",
  description: "",

  streetAddress: "",
  unit: "",
  city: "",
  state: "",
  stateLabel: "",
  postalCode: "",
  country: "",
  countryLabel: "",

  area: 0,
  yearBuilt: new Date().getFullYear(),
  bedrooms: 0,
  bathrooms: 0,
  lotSize: 0,
  numUnits: 1,
  numFloors: 1,
  parking: 0,

  currentValuation: 0,
  buildPrice: 0,
  purchaseDate: "",
  landPrice: 0,
  hasExistingStructure: false,

  hasPool: false,
  hasParkingGarage: false,
  hasElevator: false,
  hasSecuritySystem: false,
  petsAllowed: false,
  furnished: false,
  hasSolar: false,

  privateNotes: "",
};

export const generateCodeName = (): string => {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
};
