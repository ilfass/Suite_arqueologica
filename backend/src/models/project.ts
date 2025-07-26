import { supabase } from '../config/supabase';

export const ProjectModel = {
  async create(project: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}; 