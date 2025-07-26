import { User as SupabaseUser } from '@supabase/supabase-js';

export enum UserRole {
  ADMIN = 'ADMIN',
  DIRECTOR = 'DIRECTOR',
  RESEARCHER = 'RESEARCHER',
  STUDENT = 'STUDENT',
  COORDINATOR = 'COORDINATOR',
  INSTITUTION = 'INSTITUTION',
  GUEST = 'GUEST',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PROFESSIONAL = 'PROFESSIONAL',
  INSTITUTIONAL = 'INSTITUTIONAL',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  institution?: string;
  specialization?: string;
  academic_degree?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  phone?: string;
  address?: string;
  website?: string;
  bio?: string;
  specialties?: string[];
  academicDegree?: string;
  researchInterests?: string[];
  professionalAffiliations?: string[];
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  display: {
    theme: 'light' | 'dark';
    fontSize: 'small' | 'medium' | 'large';
  };
} 