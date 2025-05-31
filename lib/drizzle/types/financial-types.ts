/**
 * Type definitions for financial related entities
 */

export interface CashFlow {
  id: string;
  amount?: string;
  debit_credit?: string;
  transaction_type?: string;
  description?: string;
  timestamp?: Date;
  user_id?: string;
  family_id?: string;
  entity_id?: string;
  investment_id?: string;
  property_id?: string;
}

export interface CreditFacility {
  id: string;
  name?: string;
  type?: string;
  limit_amount?: string;
  interest_rate_type?: string;
  base_rate?: string;
  margin_rate?: string;
  start_date?: string;
  end_date?: string;
  payment_frequency?: string;
  entity_id?: string;
  status?: string;
  description?: string;
  loan_type?: string;
  repayment_type?: string;
  interest_only_period?: number;
  pi_period?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreditFacilityDrawdown {
  id: string;
  facility_id?: string;
  amount?: string;
  date?: string;
  purpose?: string;
  property_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreditFacilityRepayment {
  id: string;
  facility_id?: string;
  amount?: string;
  date?: string;
  type?: string;
  interest_amount?: string;
  principal_amount?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface OffsetAccount {
  id: string;
  name?: string;
  balance?: string;
  entity_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface FacilityOffsetAccount {
  id: string;
  facility_id?: string;
  offset_account_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface BrokerAccount {
  id: string;
  user_id?: string;
  broker_name?: string;
  account_type?: string;
  account_number?: string;
  api_key?: string;
  api_secret?: string;
  is_demo?: boolean;
  balance?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TradeJournalEntry {
  id: string;
  user_id?: string;
  date?: string;
  time?: string;
  symbol?: string;
  type?: string;
  entry_price?: string;
  stop_loss?: string;
  close_price?: string;
  pnl?: string;
  methodology?: string;
  notes?: string;
  screenshot_url?: string;
  created_at?: Date;
  updated_at?: Date;
}
