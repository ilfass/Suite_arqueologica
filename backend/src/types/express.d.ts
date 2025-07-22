import { User as SupabaseUser } from '@supabase/supabase-js';

declare namespace Express {
  interface Request {
    user?: any;
  }
}

export {}; 