import { supabase } from '@/lib/supabase'
import { Property } from '@/components/properties/types'

// Interfaces from property-detail.tsx that we need to reproduce
interface Tenant {
  id: number
  name: string
  type: "individual" | "company"
  leaseStart: Date
  leaseEnd: Date
  rentAmount: number
  status: "active" | "pending" | "past"
  contact: string
}

interface MaintenanceItem {
  id: number
  title: string
  description: string
  cost: number
  date: Date
  status: "scheduled" | "completed" | "pending"
}

interface Document {
  id: number
  name: string
  type: string
  size: string
  uploadDate: Date
  folderId: number
}

interface CashFlowItem {
  id: number
  date: Date
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  income?: number
  expenses?: number
  maintenance?: number
  month?: string
}

interface ValuationRecord {
  id: number
  date: Date
  value: number
  valuator: string
  type: string
  changePercent?: number
  appraisedBy?: string
}

interface UpcomingCashFlow {
  id: number
  date: Date
  amount: number
  type: "income" | "expense"
  description: string
  status: "scheduled" | "pending" | "completed"
}

interface DevelopmentStage {
  id: number
  name: string
  description: string
  plannedDate: Date
  actualDate?: Date
  budget: number
  actualCost?: number
  status: "planned" | "in_progress" | "completed" | "delayed"
  completionPercentage: number
}

export type PropertyWithAddress = Property & {
  address?: {
    streetNumber?: number
    streetName?: string
    streetType?: string
    suburb?: string
    state?: string
    postcode?: number
    country?: string
  }
  purchaseDate?: Date
  squareFeet?: number
  yearBuilt?: number
  zoning?: string
  parkingSpaces?: number
  bedrooms?: number
  bathrooms?: number
  description?: string
  amenities?: string[]
  // Additional fields for PropertyDetail
  tenants?: Tenant[]
  maintenanceItems?: MaintenanceItem[]
  documents?: Document[]
  cashFlowData?: CashFlowItem[]
  upcomingCashFlows?: UpcomingCashFlow[]
  valuationHistory?: ValuationRecord[]
  developmentStages?: DevelopmentStage[]
}

export async function fetchProperties() {
  try {
    const { data: properties, error } = await supabase
      .from('Investments_Properties')
      .select(`
        Id, 
        Name, 
        Type, 
        Status, 
        Current_Valuation,
        Land_Price,
        Build_Price,
        Purchase_Date,
        Last_Valuation_Date,
        Area,
        Bedrooms,
        Bathrooms,
        Parking,
        Has_Pool
      `)

    if (error) {
      throw error
    }

    // Get addresses for all properties
    const propertyIds = properties.map(p => p.Id)
    const { data: addresses, error: addressError } = await supabase
      .from('Properties_Adresses')
      .select('*')
      .in('Property_Id', propertyIds)

    if (addressError) {
      console.error('Error fetching addresses:', addressError)
    }

    // Get cash flow for all properties
    const { data: cashFlows, error: cashFlowError } = await supabase
      .from('Cash_Flow')
      .select('*')
      .in('Invest_Id', propertyIds)

    if (cashFlowError) {
      console.error('Error fetching cash flow data:', cashFlowError)
    }

    // Transform to match frontend Property type
    const transformedProperties: Property[] = properties.map(prop => {
      // Find matching address
      const address = addresses?.find(addr => addr.Property_Id === prop.Id)
      
      // Calculate income and expenses from cash flow
      const propertyFlows = cashFlows?.filter(cf => cf.Invest_Id === prop.Id) || []
      const income = propertyFlows
        .filter(cf => cf.Debit_Credit === 'credit')
        .reduce((sum, cf) => sum + Number(cf.Value), 0)
      
      const expenses = propertyFlows
        .filter(cf => cf.Debit_Credit === 'debit')
        .reduce((sum, cf) => sum + Number(cf.Value), 0)

      // Determine address string for location
      const location = address 
        ? `${address.Suburb || ''}, ${address.State || ''}`
        : 'Unknown Location'

      return {
        id: prop.Id,
        name: prop.Name || `Property ${prop.Id.substring(0, 8)}`,
        type: prop.Type || 'Unknown',
        location,
        value: prop.Current_Valuation || 0,
        income: income / 12, // Monthly income
        expenses: expenses / 12, // Monthly expenses
        occupancy: 100, // Default if not available
        status: prop.Status?.toLowerCase() === 'development' ? 'development' : 'active',
        image: '/placeholder.svg?height=200&width=300', // Default image
      }
    })

    return transformedProperties
  } catch (error) {
    console.error('Error fetching properties:', error)
    return []
  }
}

export async function fetchPropertyById(id: string) {
  try {
    // Fetch property details
    const { data: property, error } = await supabase
      .from('Investments_Properties')
      .select('*')
      .eq('Id', id)
      .single()

    if (error) {
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
      .reduce((sum, cf) => sum + Number(cf.Value), 0) || 0
    
    const expenses = cashFlows
      ?.filter(cf => cf.Debit_Credit === 'debit')
      .reduce((sum, cf) => sum + Number(cf.Value), 0) || 0

    // Format location
    const location = address 
      ? `${address.Street_Number || ''} ${address.Street_Name || ''} ${address.Street_Type || ''}, ${address.Suburb || ''}, ${address.State || ''}`
      : 'Unknown Location'

    // Transform to match frontend Property type
    const transformedProperty: PropertyWithAddress = {
      id: property.Id,
      name: property.Name || `Property ${property.Id.substring(0, 8)}`,
      type: property.Type || 'Unknown',
      location,
      value: property.Current_Valuation || 0,
      income: income / 12, // Monthly income
      expenses: expenses / 12, // Monthly expenses
      occupancy: 100, // Default if not available
      status: property.Status?.toLowerCase() === 'development' ? 'development' : 'active',
      image: '/placeholder.svg?height=200&width=300', // Default image
      address: address ? {
        streetNumber: address.Street_Number,
        streetName: address.Street_Name,
        streetType: address.Street_Type,
        suburb: address.Suburb,
        state: address.State,
        postcode: address.Postcode,
        country: address.Country
      } : undefined,
      purchaseDate: property.Purchase_Date ? new Date(property.Purchase_Date) : undefined,
      squareFeet: property.Area,
      yearBuilt: undefined, // Not available in the data model
      bedrooms: property.Bedrooms,
      bathrooms: property.Bathrooms,
      parkingSpaces: property.Parking
    }

    return transformedProperty
  } catch (error) {
    console.error('Error fetching property by ID:', error)
    return null
  }
}

export async function fetchCashFlowData(propertyId: string) {
  try {
    const { data, error } = await supabase
      .from('Cash_Flow')
      .select('*')
      .eq('Invest_Id', propertyId)
      .order('Timestamp', { ascending: true })

    if (error) {
      throw error
    }

    // Transform data into monthly cash flow format
    const monthlyData = new Map()
    
    data.forEach(item => {
      const date = new Date(item.Timestamp)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, {
          month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('default', { month: 'short' }),
          amount: 0,
          income: 0,
          expenses: 0,
          date: new Date(date.getFullYear(), date.getMonth(), 1)
        })
      }
      
      const entry = monthlyData.get(monthKey)
      const value = Number(item.Value)
      
      if (item.Debit_Credit === 'credit') {
        entry.amount += value
        entry.income += value
      } else {
        entry.amount -= value
        entry.expenses += value
      }
    })
    
    return Array.from(monthlyData.values())
  } catch (error) {
    console.error('Error fetching cash flow data:', error)
    return []
  }
} 