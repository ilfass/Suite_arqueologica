const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Usar las mismas credenciales que el Auth Service
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🏗️ Configurando base de datos para vidriera pública...');
  
  try {
    // 1. Crear la tabla public_profiles
    console.log('📋 Creando tabla public_profiles...');
    
    const createTableSQL = `
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
    `;

    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    if (createError) {
      console.log('⚠️ Error creando tabla (puede que ya exista):', createError.message);
    } else {
      console.log('✅ Tabla public_profiles creada exitosamente');
    }

    // 2. Crear índices
    console.log('📊 Creando índices...');
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_public_profiles_user_id ON public_profiles(user_id);
      CREATE INDEX IF NOT EXISTS idx_public_profiles_is_public ON public_profiles(is_public);
    `;

    const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexSQL });
    if (indexError) {
      console.log('⚠️ Error creando índices:', indexError.message);
    } else {
      console.log('✅ Índices creados exitosamente');
    }

    // 3. Habilitar RLS
    console.log('🔒 Habilitando RLS...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public_profiles ENABLE ROW LEVEL SECURITY;'
    });
    if (rlsError) {
      console.log('⚠️ Error habilitando RLS:', rlsError.message);
    } else {
      console.log('✅ RLS habilitado');
    }

    // 4. Crear políticas de seguridad
    console.log('🛡️ Creando políticas de seguridad...');
    const policies = [
      `CREATE POLICY "Users can view their own public profile" ON public_profiles FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can insert their own public profile" ON public_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY "Users can update their own public profile" ON public_profiles FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can delete their own public profile" ON public_profiles FOR DELETE USING (auth.uid() = user_id);`,
      `CREATE POLICY "Anyone can view public profiles" ON public_profiles FOR SELECT USING (is_public = true);`
    ];

    for (const policy of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', { sql: policy });
      if (policyError) {
        console.log('⚠️ Error creando política (puede que ya exista):', policyError.message);
      }
    }
    console.log('✅ Políticas de seguridad creadas');

    // 5. Insertar perfil de prueba
    console.log('👤 Insertando perfil de prueba...');
    const { data: testUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'lic.fabiande@gmail.com')
      .single();

    if (testUser) {
      const { error: insertError } = await supabase
        .from('public_profiles')
        .upsert({
          user_id: testUser.id,
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
        });

      if (insertError) {
        console.log('⚠️ Error insertando perfil de prueba:', insertError.message);
      } else {
        console.log('✅ Perfil de prueba insertado exitosamente');
      }
    } else {
      console.log('⚠️ Usuario de prueba no encontrado');
    }

    console.log('🎉 Base de datos configurada completamente!');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

setupDatabase(); 