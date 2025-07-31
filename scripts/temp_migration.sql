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

-- Habilitar RLS
ALTER TABLE public_profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Users can view their own public profile" ON public_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own public profile" ON public_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own public profile" ON public_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own public profile" ON public_profiles FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public profiles" ON public_profiles FOR SELECT USING (is_public = true);

-- Insertar perfil de prueba para el usuario lic.fabiande@gmail.com
INSERT INTO public_profiles (
    user_id,
    is_public,
    display_name,
    bio,
    specialization,
    institution,
    location,
    email,
    website,
    social_media,
    custom_message,
    public_projects,
    public_findings,
    public_reports,
    public_publications
) VALUES (
    'a9824343-3b45-4360-833c-8f241f7d835d',
    true,
    'Dr. Fabian de Haro',
    'Arqueólogo especializado en arqueología prehispánica con más de 15 años de experiencia en excavaciones en el noroeste argentino.',
    'Arqueología Prehispánica, Cerámica Antigua, Análisis de Materiales',
    'Universidad de Buenos Aires',
    'Buenos Aires, Argentina',
    'lic.fabiande@gmail.com',
    'https://arqueologia.uba.ar',
    '{"linkedin": "https://linkedin.com/in/fabiandeharo", "researchGate": "https://researchgate.net/profile/fabiandeharo", "academia": "https://uba.academia.edu/fabiandeharo"}',
    'Bienvenidos a mi espacio de investigación arqueológica. Aquí encontrarán información sobre mis proyectos, hallazgos y publicaciones en el campo de la arqueología prehispánica del noroeste argentino.',
    ARRAY['Proyecto Arqueológico Valle de Tafí (2018-2023)', 'Estudio de Cerámica Prehispánica del Noroeste', 'Análisis de Patrones de Asentamiento'],
    ARRAY['Descubrimiento de alfarería prehispánica en Tafí del Valle', 'Identificación de patrones de asentamiento en el período tardío', 'Análisis de materiales líticos en contextos domésticos'],
    ARRAY['Informe de Excavación 2022 - Sitio Tafí 1', 'Análisis de Materiales Cerámicos - Temporada 2021', 'Estudio de Distribución Espacial - Valle de Tafí'],
    ARRAY['De Haro, F. (2023). "Patrones de Asentamiento en el Valle de Tafí". Revista Arqueológica Argentina.', 'De Haro, F. et al. (2022). "Análisis de Cerámica Prehispánica del Noroeste". Arqueología del NOA.', 'De Haro, F. (2021). "Metodologías de Excavación en Contextos Domésticos". Actas del Congreso Nacional.']
) ON CONFLICT (user_id) DO UPDATE SET
    is_public = EXCLUDED.is_public,
    display_name = EXCLUDED.display_name,
    bio = EXCLUDED.bio,
    specialization = EXCLUDED.specialization,
    institution = EXCLUDED.institution,
    location = EXCLUDED.location,
    email = EXCLUDED.email,
    website = EXCLUDED.website,
    social_media = EXCLUDED.social_media,
    custom_message = EXCLUDED.custom_message,
    public_projects = EXCLUDED.public_projects,
    public_findings = EXCLUDED.public_findings,
    public_reports = EXCLUDED.public_reports,
    public_publications = EXCLUDED.public_publications,
    updated_at = NOW(); 