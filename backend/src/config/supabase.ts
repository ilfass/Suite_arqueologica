import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('🔧 Debug - SUPABASE_URL:', supabaseUrl);
console.log('🔧 Debug - SUPABASE_KEY:', supabaseKey ? 'Presente' : 'Ausente');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 