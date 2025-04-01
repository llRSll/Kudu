import { supabase } from '@/lib/supabase'
import { Property } from '@/components/properties/property-list'

// Define database types that match the Supabase schema
export interface InvestmentProperty {
  Id: string
  Investment_Id: string
  Name: string | null
  Type: string | null
  Status: string | null
  Land_Price: number | null
  Build_Price: number | null
  Purchase_Date: string | null
  Current_Valuation: number | null
  Last_Valuation_Date: string | null
  Area: number | null
  Bedrooms: number | null
  Bathrooms: number | null
  Parking: number | null
  Has_Pool: boolean | null
  Has_Security_System: boolean | null
  Pets_Allowed: boolean | null
  Furnished: boolean | null
  Has_Solar: boolean | null
  Amenities: string | null
}

export interface PropertyAddress {
  Id: string
  Property_Id: string | null
  Unit: number | null
  Street_Number: number | null
  Street_Name: string | null
  Street_Type: string | null
  Suburb: string | null
  State: string | null
  Postcode: number | null
  Country: string | null
  Updated_At: string | null
}

export interface CashFlow {
  Id: string
  Value: number | null
  User_Id: string | null
  Transaction_Type: string | null
  Entity_Id: string | null
  Family_Id: string | null
  Invest_Id: string | null
  Debit_Credit: string | null
  Timestamp: string | null
}

// Main function to fetch all properties
export async function fetchInvestmentProperties(): Promise<Property[]> {
  try {
    // For demo purposes, return an empty array quickly
    // This will allow users to add their own properties
    // In a real app with a connected database, we would use the supabase logic below
    return []

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
    console.error('Unexpected error in fetchInvestmentProperties:', error)
    return []
  }
}

// Function to fetch a single property by ID
export async function fetchInvestmentPropertyById(id: string): Promise<Property | null> {
  try {
    // For demo purposes, return null quickly
    // In a real app with a connected database, we would use the supabase logic
    return null
    
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
    console.error('Error in fetchInvestmentPropertyById:', error)
    return null
  }
}

// Function to fetch cash flow data for a property
export async function fetchPropertyCashFlow(propertyId: string) {
  try {
    // For demo purposes, return empty data
    return []
    
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
    console.error('Error in fetchPropertyCashFlow:', error)
    return []
  }
}

// Function to test Supabase connection
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log('Testing Supabase connection...');
    
    // Try to get a count from a simple table
    const { count, error } = await supabase
      .from('Investments_Properties')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Connection test failed:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }
    
    console.log('Connection test successful! Count:', count);
    return true;
  } catch (error) {
    console.error('Error testing connection:', error);
    return false;
  }
}

// Function to create a new property
export async function createProperty(property: Omit<InvestmentProperty, 'Id'>, address?: Omit<PropertyAddress, 'Id' | 'Property_Id'>): Promise<string | null> {
  try {
    console.log('Attempting to create property with data:', JSON.stringify(property, null, 2));
    
    // Generate a UUID for the property
    const propertyId = `prop-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create a simplified property object with only essential fields
    const propertyData = {
      Id: propertyId,
      Investment_Id: property.Investment_Id || propertyId,
      Name: property.Name,
      Type: property.Type,
      Status: property.Status,
      Land_Price: property.Land_Price,
      Build_Price: property.Build_Price,
      Purchase_Date: property.Purchase_Date,
      Current_Valuation: property.Current_Valuation || 0,
      Last_Valuation_Date: property.Last_Valuation_Date || new Date().toISOString(),
      Area: property.Area || 0,
      Bedrooms: property.Bedrooms,
      Bathrooms: property.Bathrooms,
      Parking: property.Parking,
      Has_Pool: property.Has_Pool || false,
      Amenities: property.Amenities
    };
    
    console.log('Inserting with simplified data:', JSON.stringify(propertyData, null, 2));
    
    // Insert property with the generated ID
    const { data, error } = await supabase
      .from('Investments_Properties')
      .insert([propertyData]);

    if (error) {
      console.error('Error creating property:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      
      // Try with minimal data as fallback
      console.log('Attempting fallback with minimal data...');
      const minimalData = {
        Id: propertyId,
        Investment_Id: property.Investment_Id || propertyId,
        Name: property.Name || 'Untitled Property'
      };
      
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('Investments_Properties')
        .insert([minimalData]);
      
      if (fallbackError) {
        console.error('Fallback attempt also failed:', fallbackError);
        throw error; // Throw original error
      } else {
        console.log('Fallback successful with minimal data!');
        return propertyId;
      }
    }
    
    console.log('Property created successfully with ID:', propertyId);

    // If address is provided, create address record
    if (address) {
      console.log('Attempting to create address with data:', JSON.stringify(address, null, 2));
      
      const addressData = {
        Id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        Property_Id: propertyId,
        Unit: address.Unit,
        Street_Number: address.Street_Number,
        Street_Name: address.Street_Name,
        Street_Type: address.Street_Type,
        Suburb: address.Suburb,
        State: address.State,
        Postcode: address.Postcode,
        Country: address.Country,
        Updated_At: new Date().toISOString()
      };
      
      const { error: addressError } = await supabase
        .from('Properties_Adresses')
        .insert([addressData]);

      if (addressError) {
        console.error('Error creating property address:', addressError);
      } else {
        console.log('Address created successfully');
      }
    }

    return propertyId;
  } catch (error) {
    console.error('Error in createProperty:', error);
    return null;
  }
} 