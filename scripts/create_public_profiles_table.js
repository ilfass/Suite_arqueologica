const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://avpaiyyjixtdopbciedr.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzE5NzI5NywiZXhwIjoyMDUyNzczMjk3fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'
);

async function createPublicProfilesTable() {
  console.log('🏗️ Creando tabla public_profiles...');
  
  try {
    // Crear la tabla public_profiles
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (createError) {
      console.log('⚠️ Error creando tabla (puede que ya exista):', createError.message);
    } else {
      console.log('✅ Tabla public_profiles creada exitosamente');
    }

    // Crear índices
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_public_profiles_user_id ON public_profiles(user_id);
        CREATE INDEX IF NOT EXISTS idx_public_profiles_is_public ON public_profiles(is_public);
      `
    });

    if (indexError) {
      console.log('⚠️ Error creando índices:', indexError.message);
    } else {
      console.log('✅ Índices creados exitosamente');
    }

    // Habilitar RLS
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public_profiles ENABLE ROW LEVEL SECURITY;`
    });

    if (rlsError) {
      console.log('⚠️ Error habilitando RLS:', rlsError.message);
    } else {
      console.log('✅ RLS habilitado');
    }

    // Crear políticas de seguridad
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

    // Insertar un perfil de prueba
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
          bio: 'Arqueólogo especializado en arqueología prehispánica con más de 15 años de experiencia.',
          specialization: 'Arqueología Prehispánica, Cerámica Antigua',
          institution: 'Universidad de Buenos Aires',
          location: 'Buenos Aires, Argentina',
          email: 'lic.fabiande@gmail.com',
          website: 'https://arqueologia.uba.ar',
          social_media: {
            linkedin: 'https://linkedin.com/in/fabiandeharo',
            researchGate: 'https://researchgate.net/profile/fabiandeharo'
          },
          custom_message: 'Bienvenidos a mi espacio de investigación arqueológica.',
          public_projects: ['Proyecto Valle de Tafí', 'Estudio de Cerámica Prehispánica'],
          public_findings: ['Descubrimiento de alfarería prehispánica'],
          public_reports: ['Informe de Excavación 2022'],
          public_publications: ['De Haro, F. (2023). "Patrones de Asentamiento"']
        });

      if (insertError) {
        console.log('⚠️ Error insertando perfil de prueba:', insertError.message);
      } else {
        console.log('✅ Perfil de prueba insertado exitosamente');
      }
    }

    console.log('🎉 Tabla public_profiles configurada completamente!');

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

createPublicProfilesTable(); 