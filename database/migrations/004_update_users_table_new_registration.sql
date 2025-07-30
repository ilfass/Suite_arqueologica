-- Migración para actualizar la tabla users con campos específicos por rol
-- Ejecutar en Supabase SQL Editor

-- Agregar campos comunes
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP WITH TIME ZONE;

-- Agregar campos específicos para INSTITUTION
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS institution_name TEXT,
ADD COLUMN IF NOT EXISTS institution_address TEXT,
ADD COLUMN IF NOT EXISTS institution_website TEXT,
ADD COLUMN IF NOT EXISTS institution_department TEXT,
ADD COLUMN IF NOT EXISTS institution_email TEXT,
ADD COLUMN IF NOT EXISTS institution_alternative_email TEXT;

-- Agregar campos específicos para DIRECTOR
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS director_document_id TEXT,
ADD COLUMN IF NOT EXISTS director_highest_degree TEXT,
ADD COLUMN IF NOT EXISTS director_discipline TEXT,
ADD COLUMN IF NOT EXISTS director_formation_institution TEXT,
ADD COLUMN IF NOT EXISTS director_current_institution TEXT,
ADD COLUMN IF NOT EXISTS director_current_position TEXT,
ADD COLUMN IF NOT EXISTS director_cv_link TEXT;

-- Agregar campos específicos para RESEARCHER
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS researcher_document_id TEXT,
ADD COLUMN IF NOT EXISTS researcher_career TEXT,
ADD COLUMN IF NOT EXISTS researcher_year TEXT,
ADD COLUMN IF NOT EXISTS researcher_formation_institution TEXT,
ADD COLUMN IF NOT EXISTS researcher_role TEXT,
ADD COLUMN IF NOT EXISTS researcher_area TEXT,
ADD COLUMN IF NOT EXISTS researcher_director_id UUID REFERENCES public.users(id);

-- Agregar campos específicos para STUDENT
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS student_document_id TEXT,
ADD COLUMN IF NOT EXISTS student_highest_degree TEXT,
ADD COLUMN IF NOT EXISTS student_discipline TEXT,
ADD COLUMN IF NOT EXISTS student_formation_institution TEXT,
ADD COLUMN IF NOT EXISTS student_current_institution TEXT,
ADD COLUMN IF NOT EXISTS student_current_position TEXT,
ADD COLUMN IF NOT EXISTS student_cv_link TEXT;

-- Actualizar la restricción de roles para incluir DIRECTOR
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('DIRECTOR', 'RESEARCHER', 'STUDENT', 'INSTITUTION', 'GUEST'));

-- Migrar datos existentes (si los hay)
UPDATE public.users 
SET 
  first_name = CASE 
    WHEN full_name IS NOT NULL THEN split_part(full_name, ' ', 1)
    ELSE email
  END,
  last_name = CASE 
    WHEN full_name IS NOT NULL AND position(' ' in full_name) > 0 
    THEN substring(full_name from position(' ' in full_name) + 1)
    ELSE ''
  END,
  country = 'Argentina',
  province = 'Buenos Aires',
  city = 'La Plata'
WHERE first_name IS NULL;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_country ON public.users(country);
CREATE INDEX IF NOT EXISTS idx_users_terms_accepted ON public.users(terms_accepted);
CREATE INDEX IF NOT EXISTS idx_users_researcher_director_id ON public.users(researcher_director_id);

-- Comentarios para documentar los campos
COMMENT ON COLUMN public.users.first_name IS 'Nombre del usuario';
COMMENT ON COLUMN public.users.last_name IS 'Apellido del usuario';
COMMENT ON COLUMN public.users.country IS 'País del usuario';
COMMENT ON COLUMN public.users.province IS 'Provincia/Estado del usuario';
COMMENT ON COLUMN public.users.city IS 'Ciudad del usuario';
COMMENT ON COLUMN public.users.terms_accepted IS 'Indica si el usuario aceptó los términos y condiciones';
COMMENT ON COLUMN public.users.terms_accepted_at IS 'Fecha y hora de aceptación de términos';

-- Comentarios para campos de INSTITUTION
COMMENT ON COLUMN public.users.institution_name IS 'Nombre de la institución (solo para rol INSTITUTION)';
COMMENT ON COLUMN public.users.institution_address IS 'Dirección de la institución (solo para rol INSTITUTION)';
COMMENT ON COLUMN public.users.institution_website IS 'Sitio web institucional (solo para rol INSTITUTION)';
COMMENT ON COLUMN public.users.institution_department IS 'Unidad/Departamento/Área (solo para rol INSTITUTION)';
COMMENT ON COLUMN public.users.institution_email IS 'Correo electrónico institucional (solo para rol INSTITUTION)';
COMMENT ON COLUMN public.users.institution_alternative_email IS 'Correo alternativo (solo para rol INSTITUTION)';

-- Comentarios para campos de DIRECTOR
COMMENT ON COLUMN public.users.director_document_id IS 'DNI/INE/Cédula/Pasaporte (solo para rol DIRECTOR)';
COMMENT ON COLUMN public.users.director_highest_degree IS 'Título máximo alcanzado (solo para rol DIRECTOR)';
COMMENT ON COLUMN public.users.director_discipline IS 'Disciplina principal (solo para rol DIRECTOR)';
COMMENT ON COLUMN public.users.director_formation_institution IS 'Institución de formación (solo para rol DIRECTOR)';
COMMENT ON COLUMN public.users.director_current_institution IS 'Institución actual de pertenencia (solo para rol DIRECTOR)';
COMMENT ON COLUMN public.users.director_current_position IS 'Cargo actual/Posición (solo para rol DIRECTOR)';
COMMENT ON COLUMN public.users.director_cv_link IS 'CV/Link a ORCID/CONICET/Academia.edu (solo para rol DIRECTOR)';

-- Comentarios para campos de RESEARCHER
COMMENT ON COLUMN public.users.researcher_document_id IS 'DNI/INE/Cédula/Pasaporte (solo para rol RESEARCHER)';
COMMENT ON COLUMN public.users.researcher_career IS 'Carrera/Programa académico (solo para rol RESEARCHER)';
COMMENT ON COLUMN public.users.researcher_year IS 'Año en curso (solo para rol RESEARCHER)';
COMMENT ON COLUMN public.users.researcher_formation_institution IS 'Institución de formación (solo para rol RESEARCHER)';
COMMENT ON COLUMN public.users.researcher_role IS 'Rol (pasante, tesista, ayudante, becario, etc.) (solo para rol RESEARCHER)';
COMMENT ON COLUMN public.users.researcher_area IS 'Área de investigación (solo para rol RESEARCHER)';
COMMENT ON COLUMN public.users.researcher_director_id IS 'ID del director que dirige al investigador (solo para rol RESEARCHER)';

-- Comentarios para campos de STUDENT
COMMENT ON COLUMN public.users.student_document_id IS 'DNI/INE/Cédula/Pasaporte (solo para rol STUDENT)';
COMMENT ON COLUMN public.users.student_highest_degree IS 'Título máximo alcanzado (solo para rol STUDENT)';
COMMENT ON COLUMN public.users.student_discipline IS 'Disciplina principal (solo para rol STUDENT)';
COMMENT ON COLUMN public.users.student_formation_institution IS 'Institución de formación (solo para rol STUDENT)';
COMMENT ON COLUMN public.users.student_current_institution IS 'Institución actual de pertenencia (solo para rol STUDENT)';
COMMENT ON COLUMN public.users.student_current_position IS 'Cargo actual/Posición (solo para rol STUDENT)';
COMMENT ON COLUMN public.users.student_cv_link IS 'CV/Link a ORCID/CONICET/Academia.edu (solo para rol STUDENT)'; 