import { Property } from "@/components/properties/types";
import { supabase } from "@/lib/supabase";
import { count } from "console";
import { v4 as uuidv4 } from "uuid";

// Define database types that match the Supabase schema
export interface InvestmentProperty {
  Id: string;
  Investment_Id: string;
  Name: string | null;
  Type: string | null;
  Status: string | null;
  Land_Price: number | null;
  Build_Price: number | null;
  Purchase_Date: string | null;
  Current_Valuation: number | null;
  Last_Valuation_Date: string | null;
  Area: number | null;
  Bedrooms: number | null;
  Bathrooms: number | null;
  Parking: number | null;
  Has_Pool: boolean | null;
  Has_Security_System: boolean | null;
  Pets_Allowed: boolean | null;
  Furnished: boolean | null;
  Has_Solar: boolean | null;
  Amenities: string | null;
}

export interface PropertyAddress {
  Id: string;
  Property_Id: string | null;
  Unit: number | null;
  Street_Number: number | null;
  Street_Name: string | null;
  Street_Type: string | null;
  Suburb: string | null;
  State: string | null;
  Postcode: number | null;
  Country: string | null;
  Updated_At: string | null;
}

export interface CashFlow {
  Id: string;
  Value: number | null;
  User_Id: string | null;
  Transaction_Type: string | null;
  Entity_Id: string | null;
  Family_Id: string | null;
  Invest_Id: string | null;
  Debit_Credit: string | null;
  Timestamp: string | null;
}

// Main function to fetch all properties
export async function fetchInvestmentProperties(): Promise<Property[]> {
  try {
    // For demo purposes, return an empty array quickly
    // This will allow users to add their own properties
    // In a real app with a connected database, we would use the supabase logic below
    return [];

    /*
    // The following code is disabled for the demo but would work with a real database
    const { data, error } = await supabase
      .from('Investments_Properties')
      .select('*')

    if (error) {
      console.error('Error fetching properties:', error)
      return []
    }

    const properties = data || []
    if (properties.length === 0) {
      console.log('No properties found')
      return []
    }

    // Fetch addresses for all properties
    const propertyIds = properties.map(p => p.Id)
    let addresses = []
    
    try {
      const { data: addressData, error: addressError } = await supabase
        .from('Properties_Adresses')
        .select('*')
        .in('Property_Id', propertyIds)

      if (addressError) {
        console.error('Error fetching addresses:', addressError)
      } else {
        addresses = addressData || []
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err)
    }

    // Fetch cash flow data for all properties
    let cashFlows = []
    
    try {
      const { data: cashFlowData, error: cashFlowError } = await supabase
        .from('Cash_Flow')
        .select('*')
        .in('Invest_Id', propertyIds)

      if (cashFlowError) {
        console.error('Error fetching cash flow data:', cashFlowError)
      } else {
        cashFlows = cashFlowData || []
      }
    } catch (err) {
      console.error('Failed to fetch cash flows:', err)
    }

    // Transform to match frontend Property interface
    const transformedProperties: Property[] = properties.map(prop => {
      // Find matching address
      const address = addresses?.find(addr => addr.Property_Id === prop.Id)
      
      // Calculate income and expenses from cash flow
      const propertyFlows = cashFlows?.filter(cf => cf.Invest_Id === prop.Id) || []
      
      // Monthly income (credits)
      const income = propertyFlows
        .filter(cf => cf.Debit_Credit === 'credit')
        .reduce((sum, cf) => sum + Number(cf.Value || 0), 0) / 12
      
      // Monthly expenses (debits)
      const expenses = propertyFlows
        .filter(cf => cf.Debit_Credit === 'debit')
        .reduce((sum, cf) => sum + Number(cf.Value || 0), 0) / 12

      // Format location from address
      const location = address 
        ? `${address.Suburb || ''}, ${address.State || ''}`
        : 'Unknown Location'

      // Default to 100% occupancy if not specified
      const occupancy = 100

      return {
        id: prop.Id,
        name: prop.Name || `Property ${prop.Id.substring(0, 8)}`,
        type: prop.Type || 'Unknown',
        location,
        value: prop.Current_Valuation || 0,
        income,
        expenses,
        occupancy,
        status: prop.Status?.toLowerCase() === 'development' ? 'development' : 'active',
        image: '/placeholder.svg?height=200&width=300', // Default image
      }
    })

    return transformedProperties
    */
  } catch (error) {
    console.error("Unexpected error in fetchInvestmentProperties:", error);
    return [];
  }
}

// Function to fetch a single property by ID
export async function fetchInvestmentPropertyById(
  id: string
): Promise<Property | null> {
  try {
    // For demo purposes, return null quickly
    // In a real app with a connected database, we would use the supabase logic
    return null;

    /*
    const { data: property, error } = await supabase
      .from('Investments_Properties')
      .select('*')
      .eq('Id', id)
      .single()

    if (error) {
      console.error('Error fetching property by ID:', error)
      throw error
    }

    // Fetch address
    const { data: address, error: addressError } = await supabase
      .from('Properties_Adresses')
      .select('*')
      .eq('Property_Id', id)
      .single()

    if (addressError && addressError.code !== 'PGRST116') { // Not found error
      console.error('Error fetching address:', addressError)
    }

    // Fetch cash flow
    const { data: cashFlows, error: cashFlowError } = await supabase
      .from('Cash_Flow')
      .select('*')
      .eq('Invest_Id', id)

    if (cashFlowError) {
      console.error('Error fetching cash flow data:', cashFlowError)
    }

    // Calculate income and expenses
    const income = cashFlows
      ?.filter(cf => cf.Debit_Credit === 'credit')
      .reduce((sum, cf) => sum + Number(cf.Value || 0), 0) / 12 || 0
    
    const expenses = cashFlows
      ?.filter(cf => cf.Debit_Credit === 'debit')
      .reduce((sum, cf) => sum + Number(cf.Value || 0), 0) / 12 || 0

    // Format location
    const location = address 
      ? `${address.Street_Number || ''} ${address.Street_Name || ''} ${address.Street_Type || ''}, ${address.Suburb || ''}, ${address.State || ''}`
      : 'Unknown Location'

    return {
      id: property.Id,
      name: property.Name || `Property ${property.Id.substring(0, 8)}`,
      type: property.Type || 'Unknown',
      location,
      value: property.Current_Valuation || 0,
      income,
      expenses,
      occupancy: 100, // Default if not available
      status: property.Status?.toLowerCase() === 'development' ? 'development' : 'active',
      image: '/placeholder.svg?height=200&width=300', // Default image
    }
    */
  } catch (error) {
    console.error("Error in fetchInvestmentPropertyById:", error);
    return null;
  }
}

// Function to fetch cash flow data for a property
export async function fetchPropertyCashFlow(propertyId: string) {
  try {
    // For demo purposes, return empty data
    return [];

    /*
    const { data, error } = await supabase
      .from('Cash_Flow')
      .select('*')
      .eq('Invest_Id', propertyId)
      .order('Timestamp', { ascending: true })

    if (error) {
      console.error('Error fetching cash flow:', error)
      throw error
    }

    // Group by month
    const monthlyData = new Map()
    
    data?.forEach(item => {
      if (!item.Timestamp) return
      
      const date = new Date(item.Timestamp)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: date.toLocaleString('default', { month: 'short' }),
          amount: 0,
          income: 0,
          expenses: 0,
          maintenance: 0,
          date: new Date(date.getFullYear(), date.getMonth(), 1)
        })
      }
      
      const entry = monthlyData.get(monthKey)
      const value = Number(item.Value || 0)
      
      if (item.Debit_Credit === 'credit') {
        entry.amount += value
        entry.income += value
      } else {
        entry.amount -= value
        
        // Separate maintenance expenses if specified
        if (item.Transaction_Type === 'maintenance') {
          entry.maintenance += value
        } else {
          entry.expenses += value
        }
      }
    })
    
    return Array.from(monthlyData.values())
    */
  } catch (error) {
    console.error("Error in fetchPropertyCashFlow:", error);
    return [];
  }
}

// Function to test Supabase connection
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log("Testing Supabase connection...");

    // Try to get a count from a simple table
    const { count, error } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Connection test failed:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return false;
    }

    console.log("Connection test successful! Count:", count);
    return true;
  } catch (error) {
    console.error("Error testing connection:", error);
    return false;
  }
}

export async function createProperty(
  property: Omit<Property, "Id"> & { userId?: string }
  // address?: Omit<PropertyAddress, "Id" | "Property_Id">
): Promise<{ id: string | null; error?: string }> {
  try {
    if (!property.userId) {
      console.error("No userId provided to createProperty");
      return { id: null, error: "Please login or provide a valid user ID." };
    }
    console.log(
      "Attempting to create property with data:",
      JSON.stringify(property, null, 2)
    );

    const propertyId = uuidv4();
    const entity_id = "580a11fa-a8ca-4f86-a69c-a9daf4224d93";
    const investment_id = "b4255abe-fd83-41d0-b8a0-c86a8df42594";

    // Prepare the nested payload if address is provided
    let payload: any = {
      id: propertyId,
      investment_id: investment_id,
      name: property.name,
      type: property.type,
      status: property.status,
      land_price: property.landPrice,
      build_price: property.buildPrice,
      purchase_date: property.purchaseDate,
      current_valuation: property.currentValuation || 0,
      last_valuation_date:
        property.lastValuationDate || new Date().toISOString(),
      area: property.area || 0,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parking: property.parking,
      has_pool: property.hasPool || false,
      amenities: property.amenities,
      entity_id: entity_id,
      unit: property.unit,
      street_number: property.streetNumber,
      street_name: property.streetName,
      suburb: property.suburb,
      state: property.state,
      postcode: property.postcode,
      country: property.country,
      updated_at: new Date().toISOString(),
      user_id: property.userId, // Add user_id to payload
    };

    console.log("Payload for DB insert:", JSON.stringify(payload, null, 2));
    // Use nested insert if address is provided, otherwise simple insert
    const { data, error } = await supabase
      .from("properties")
      .insert([payload], { defaultToNull: true }); // Remove 'returning', use 'defaultToNull' for supabase-js v2

    if (error) {
      console.error("Error creating property (with address):", error);
      return { id: null, error: error.message || String(error) };
    }

    return { id: propertyId };
  } catch (error: any) {
    console.error("Error in createProperty:", error);
    return { id: null, error: error?.message || String(error) };
  }
}

/**
 * Fetch all properties from the "properties" table in Supabase.
 * Returns an array of Property objects or an empty array on error.
 */
export async function fetchProperties(userId: string): Promise<Property[]> {
  try {
    if (!userId) {
      console.error("No userId provided to fetchProperties");
      return [];
    }
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching properties:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("No properties found for user:", userId);
      return [];
    }

    return data as Property[];
  } catch (err) {
    console.error("Unexpected error in fetchProperties:", err);
    return [];
  }
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    if (!id) {
      console.error("No property id provided to fetchPropertyById");
      return null;
    }
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        console.warn(`Property with id ${id} not found.`);
        return null;
      }
      console.error("Error fetching property by id:", error);
      return null;
    }
    if (!data) {
      console.warn(`No data returned for property id ${id}.`);
      return null;
    }
    return data as unknown as Property;
  } catch (error: any) {
    console.error("Unexpected error in fetchPropertyById:", error);
    return null;
  }
}
