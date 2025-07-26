import { Area } from '../types/archaeological';
import { AreaModel } from '../models/area';

export class AreaService {
  static async createArea(areaData: Partial<Area>, userId: string): Promise<Area> {
    return await AreaModel.create({ ...areaData, created_by: userId });
  }

  static async getAllAreas(): Promise<Area[]> {
    return await AreaModel.getAll();
  }

  static async getAreaById(id: string): Promise<Area | null> {
    return await AreaModel.getById(id);
  }
} 