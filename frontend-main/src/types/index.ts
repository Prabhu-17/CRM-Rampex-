export type AppRole = 'admin' | 'manager' | 'sales' | 'support';

export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export type InteractionType = 'call' | 'email' | 'meeting' | 'note' | 'task';

export type ContractStatus = 'draft' | 'pending' | 'active' | 'expired' | 'terminated';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  role: AppRole;
  team_id?: string;
  manager_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  status: 'active' | 'inactive' | 'prospect';
  owner_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  client_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  title: string;
  company?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  value?: number;
  stage: LeadStage;
  source?: string;
  score: number;
  assigned_to?: string;
  created_by?: string;
  expected_close_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Interaction {
  id: string;
  type: InteractionType;
  subject: string;
  description?: string;
  client_id?: string;
  lead_id?: string;
  contact_id?: string;
  created_by?: string;
  participants?: string[];
  scheduled_at?: string;
  completed_at?: string;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  value?: number;
  status: ContractStatus;
  start_date?: string;
  end_date?: string;
  file_url?: string;
  version: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message?: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  link?: string;
  created_at: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_conditions: any;
  actions: any;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  user_id?: string;
  entity_type: string;
  entity_id: string;
  action: string;
  description?: string;
  metadata?: any;
  created_at: string;
}
