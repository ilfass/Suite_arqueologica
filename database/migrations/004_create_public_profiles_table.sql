-- Crear tabla public_profiles
CREATE TABLE IF NOT EXISTS public_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    display_name TEXT,
    bio TEXT,
    specialization TEXT,
    institution TEXT,
    location TEXT,
    email TEXT,
    website TEXT,
    social_media JSONB DEFAULT '{}',
    custom_message TEXT,
    public_projects TEXT[] DEFAULT '{}',
    public_findings TEXT[] DEFAULT '{}',
    public_reports TEXT[] DEFAULT '{}',
    public_publications TEXT[] DEFAULT '{}',
    profile_image TEXT,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_public_profiles_user_id ON public_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_public_profiles_is_public ON public_profiles(is_public);

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_public_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_public_profiles_updated_at
    BEFORE UPDATE ON public_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_public_profiles_updated_at();

-- Agregar políticas de seguridad RLS
ALTER TABLE public_profiles ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios puedan ver su propio perfil público
CREATE POLICY "Users can view their own public profile" ON public_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios puedan insertar su propio perfil público
CREATE POLICY "Users can insert their own public profile" ON public_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar su propio perfil público
CREATE POLICY "Users can update their own public profile" ON public_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para que los usuarios puedan eliminar su propio perfil público
CREATE POLICY "Users can delete their own public profile" ON public_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Política para que cualquier usuario pueda ver perfiles públicos
CREATE POLICY "Anyone can view public profiles" ON public_profiles
    FOR SELECT USING (is_public = true); 