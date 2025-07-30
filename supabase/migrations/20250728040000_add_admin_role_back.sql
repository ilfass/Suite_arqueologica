-- Agregar el rol ADMIN de vuelta a la restricción CHECK
-- Esto es necesario porque el administrador del sistema debe poder existir

-- Primero, eliminar la restricción actual
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Luego, agregar la nueva restricción que incluye ADMIN
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
CHECK (role IN ('ADMIN', 'DIRECTOR', 'RESEARCHER', 'STUDENT', 'INSTITUTION', 'GUEST'));

-- Comentario explicativo
COMMENT ON CONSTRAINT users_role_check ON public.users IS 
'Restricción que permite los roles: ADMIN (sistema), DIRECTOR, RESEARCHER, STUDENT, INSTITUTION, GUEST'; 