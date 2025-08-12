export interface Project {
    id: string;
    name: string;
    description?: string;
    directorId: string;
    institutionId?: string;
    status: ProjectStatus;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    location?: GeoLocation;
    createdAt: Date;
    updatedAt: Date;
}
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export interface Area {
    id: string;
    name: string;
    description?: string;
    projectId: string;
    siteId?: string;
    location: GeoLocation;
    areaSize?: number;
    excavationStatus: ExcavationStatus;
    createdAt: Date;
    updatedAt: Date;
}
export type ExcavationStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
export interface ArchaeologicalSite {
    id: string;
    name: string;
    description?: string;
    location: GeoLocation;
    siteType: SiteType;
    period: HistoricalPeriod;
    status: SiteStatus;
    projectId?: string;
    areaId?: string;
    discoveryDate?: Date;
    excavationDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type SiteType = 'SETTLEMENT' | 'CEMETERY' | 'TEMPLE' | 'FORTIFICATION' | 'WORKSHOP' | 'OTHER';
export type SiteStatus = 'DISCOVERED' | 'EXCAVATED' | 'PRESERVED' | 'DESTROYED';
export type HistoricalPeriod = 'PREHISTORIC' | 'ANCIENT' | 'MEDIEVAL' | 'MODERN' | 'UNKNOWN';
export interface GeoLocation {
    latitude: number;
    longitude: number;
    altitude?: number;
}
export interface ContextHierarchy {
    project: Project;
    areas: Area[];
    sites: ArchaeologicalSite[];
}
export interface ContextPermissions {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canManage: boolean;
}
//# sourceMappingURL=context.d.ts.map