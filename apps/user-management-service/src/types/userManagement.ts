export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio: string;
  specialization: string;
  experience: number; // años de experiencia
  education: string;
  publications: string[];
  awards: string[];
  avatar: string;
  socialLinks: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    researchGate?: string;
  };
  location: {
    country: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserRelationship {
  id: string;
  requesterId: string;
  recipientId: string;
  type: 'DIRECTOR_RESEARCHER' | 'RESEARCHER_STUDENT' | 'COLLABORATOR';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  directorId: string;
  members: TeamMember[];
  projectId?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  userId: string;
  role: 'DIRECTOR' | 'RESEARCHER' | 'STUDENT' | 'ASSISTANT';
  joinedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  type: 'FOLLOW' | 'COLLABORATE' | 'MENTOR';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface CreateProfileRequest {
  firstName: string;
  lastName: string;
  bio: string;
  specialization: string;
  experience: number;
  education: string;
  publications?: string[];
  awards?: string[];
  avatar?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    researchGate?: string;
  };
  location: {
    country: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  specialization?: string;
  experience?: number;
  education?: string;
  publications?: string[];
  awards?: string[];
  avatar?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    researchGate?: string;
  };
  location?: {
    country: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface CreateRelationshipRequest {
  recipientId: string;
  type: 'DIRECTOR_RESEARCHER' | 'RESEARCHER_STUDENT' | 'COLLABORATOR';
  message?: string;
}

export interface CreateTeamRequest {
  name: string;
  description: string;
  members?: string[];
  projectId?: string;
}

export interface UserManagementResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} 