import { UserRole } from '../types/auth';

export const ROLES: Record<UserRole, string> = {
  ADMIN: 'Administrador del Sistema',
  DIRECTOR: 'Director de Proyecto',
  RESEARCHER: 'Investigador',
  STUDENT: 'Estudiante',
  INSTITUTION: 'Institución',
  GUEST: 'Invitado'
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 6,
  INSTITUTION: 5,
  DIRECTOR: 4,
  RESEARCHER: 3,
  STUDENT: 2,
  GUEST: 1
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    'system:full-access',
    'users:manage',
    'institutions:manage',
    'projects:manage',
    'sites:manage',
    'reports:generate',
    'system:configure'
  ],
  INSTITUTION: [
    'institution:manage',
    'members:manage',
    'projects:view',
    'reports:generate',
    'billing:manage'
  ],
  DIRECTOR: [
    'projects:manage',
    'teams:manage',
    'sites:manage',
    'areas:manage',
    'reports:generate',
    'findings:approve'
  ],
  RESEARCHER: [
    'projects:view',
    'sites:view',
    'areas:view',
    'findings:create',
    'findings:edit',
    'reports:create'
  ],
  STUDENT: [
    'projects:view',
    'sites:view',
    'areas:view',
    'findings:view',
    'reports:view'
  ],
  GUEST: [
    'public:view',
    'sites:public-view',
    'maps:view'
  ]
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ADMIN: 'Acceso completo al sistema. Puede gestionar usuarios, instituciones, proyectos y configurar el sistema.',
  DIRECTOR: 'Dirige proyectos arqueológicos. Puede gestionar equipos, sitios, áreas y aprobar hallazgos.',
  RESEARCHER: 'Realiza investigaciones arqueológicas. Puede crear y editar hallazgos, reportes y documentación.',
  STUDENT: 'Estudiante en formación. Acceso limitado para aprendizaje y colaboración en proyectos.',
  INSTITUTION: 'Representa una institución académica o gubernamental. Gestiona miembros y proyectos institucionales.',
  GUEST: 'Usuario invitado. Solo puede ver contenido público sin capacidad de edición.'
};

export const ROLE_REQUIREMENTS: Record<UserRole, string[]> = {
  ADMIN: ['Verificación manual', 'Credenciales especiales'],
  DIRECTOR: ['Experiencia verificada', 'Aprobación institucional'],
  RESEARCHER: ['Credenciales académicas', 'Aprobación de director'],
  STUDENT: ['Credenciales estudiantiles', 'Supervisión académica'],
  INSTITUTION: ['Verificación institucional', 'Documentación oficial'],
  GUEST: ['Registro básico', 'Sin verificación']
}; 