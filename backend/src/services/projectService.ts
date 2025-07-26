import { AreaModel } from '../models/area';
import { ProjectAreaModel } from '../models/projectArea';
import { ProjectModel } from '../models/project';
import { Area } from '../types/archaeological';

export class ProjectService {
  static async createProjectWithAreas(projectData: any, userId: string) {
    // Separar áreas nuevas y existentes
    const areas: (string | Partial<Area>)[] = projectData.areas || [];
    delete projectData.areas;
    // Crear el proyecto
    const project = await ProjectModel.create({ ...projectData, created_by: userId });
    // Procesar áreas
    const areaIds: string[] = [];
    for (const area of areas) {
      if (typeof area === 'string') {
        areaIds.push(area);
      } else if (area && area.name) {
        const newArea = await AreaModel.create({ ...area, created_by: userId });
        areaIds.push(newArea.id);
      }
    }
    // Asociar áreas al proyecto
    await ProjectAreaModel.addMultiple(project.id, areaIds);
    return { ...project, areaIds };
  }
} 