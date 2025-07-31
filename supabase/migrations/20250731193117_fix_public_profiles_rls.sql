-- Deshabilitar RLS temporalmente para desarrollo
ALTER TABLE public_profiles DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Enable read access for all users" ON public_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public_profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public_profiles;

-- Crear políticas permisivas para desarrollo
CREATE POLICY "Allow all operations for development" ON public_profiles
FOR ALL USING (true);

-- Alternativamente, crear políticas específicas si se quiere más control
-- CREATE POLICY "Allow authenticated read" ON public_profiles
-- FOR SELECT USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated insert" ON public_profiles
-- FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated update" ON public_profiles
-- FOR UPDATE USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow authenticated delete" ON public_profiles
-- FOR DELETE USING (auth.role() = 'authenticated');
