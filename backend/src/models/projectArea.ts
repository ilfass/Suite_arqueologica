import { supabase } from '../config/supabase';

export const ProjectAreaModel = {
  async addProjectArea(project_id: string, area_id: string) {
    const { error } = await supabase
      .from('project_areas')
      .insert([{ project_id, area_id }]);
    if (error) throw new Error(error.message);
  },
  async addMultiple(project_id: string, area_ids: string[]) {
    if (!area_ids.length) return;
    const rows = area_ids.map(area_id => ({ project_id, area_id }));
    const { error } = await supabase
      .from('project_areas')
      .insert(rows);
    if (error) throw new Error(error.message);
  }
}; 