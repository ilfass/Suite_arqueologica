const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTableDirect() {
  console.log('🏗️ Creando tabla public_profiles directamente...');
  
  try {
    // Intentar insertar un registro de prueba para crear la tabla
    console.log('📝 Intentando crear tabla insertando datos de prueba...');
    
    const testData = {
      user_id: 'a9824343-3b45-4360-833c-8f241f7d835d',
      is_public: true,
      display_name: 'Dr. Fabian de Haro',
      bio: 'Arqueólogo especializado en arqueología prehispánica con más de 15 años de experiencia en excavaciones en el noroeste argentino.',
      specialization: 'Arqueología Prehispánica, Cerámica Antigua, Análisis de Materiales',
      institution: 'Universidad de Buenos Aires',
      location: 'Buenos Aires, Argentina',
      email: 'lic.fabiande@gmail.com',
      website: 'https://arqueologia.uba.ar',
      social_media: {
        linkedin: 'https://linkedin.com/in/fabiandeharo',
        researchGate: 'https://researchgate.net/profile/fabiandeharo',
        academia: 'https://uba.academia.edu/fabiandeharo'
      },
      custom_message: 'Bienvenidos a mi espacio de investigación arqueológica. Aquí encontrarán información sobre mis proyectos, hallazgos y publicaciones en el campo de la arqueología prehispánica del noroeste argentino.',
      public_projects: [
        'Proyecto Arqueológico Valle de Tafí (2018-2023)',
        'Estudio de Cerámica Prehispánica del Noroeste',
        'Análisis de Patrones de Asentamiento'
      ],
      public_findings: [
        'Descubrimiento de alfarería prehispánica en Tafí del Valle',
        'Identificación de patrones de asentamiento en el período tardío',
        'Análisis de materiales líticos en contextos domésticos'
      ],
      public_reports: [
        'Informe de Excavación 2022 - Sitio Tafí 1',
        'Análisis de Materiales Cerámicos - Temporada 2021',
        'Estudio de Distribución Espacial - Valle de Tafí'
      ],
      public_publications: [
        'De Haro, F. (2023). "Patrones de Asentamiento en el Valle de Tafí". Revista Arqueológica Argentina.',
        'De Haro, F. et al. (2022). "Análisis de Cerámica Prehispánica del Noroeste". Arqueología del NOA.',
        'De Haro, F. (2021). "Metodologías de Excavación en Contextos Domésticos". Actas del Congreso Nacional.'
      ]
    };

    const { data, error } = await supabase
      .from('public_profiles')
      .insert([testData])
      .select();

    if (error) {
      console.log('❌ Error creando tabla:', error.message);
      console.log('💡 La tabla debe ser creada manualmente en Supabase Dashboard');
      console.log('📋 SQL para crear la tabla:');
      console.log(`
CREATE TABLE public_profiles (
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

CREATE INDEX idx_public_profiles_user_id ON public_profiles(user_id);
CREATE INDEX idx_public_profiles_is_public ON public_profiles(is_public);

ALTER TABLE public_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own public profile" ON public_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own public profile" ON public_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own public profile" ON public_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own public profile" ON public_profiles FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public profiles" ON public_profiles FOR SELECT USING (is_public = true);
      `);
    } else {
      console.log('✅ Tabla creada y datos insertados exitosamente');
      console.log('📊 Datos insertados:', data);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createTableDirect(); 