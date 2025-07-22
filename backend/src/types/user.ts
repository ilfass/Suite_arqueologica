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

export interface User extends SupabaseUser {
  fullName: string;
  role: UserRole;
  subscriptionPlan: SubscriptionPlan;
  institution?: string;
  createdAt: Date;
  updatedAt: Date;
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