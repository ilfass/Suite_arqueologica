import { supabase } from '../config/supabase';
import { Area } from '../types/archaeological';

export const AreaModel = {
  async create(area: Partial<Area>): Promise<Area> {
    const { data, error } = await supabase
      .from('areas')
      .insert([area])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
  async getAll(): Promise<Area[]> {
    const { data, error } = await supabase
      .from('areas')
      .select('*');
    if (error) throw new Error(error.message);
    return data || [];
  },
  async getById(id: string): Promise<Area | null> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  }
}; 