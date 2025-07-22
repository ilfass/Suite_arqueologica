const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase (usando las credenciales del proyecto)
const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjE5NzI5MCwiZXhwIjoyMDQ3NzczMjkwfQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

console.log('🔧 Conectando a Supabase...');
console.log('📡 URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function createResearcherUser() {
  try {
    console.log('🔧 Creando usuario RESEARCHER directamente en Supabase...');
    
    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'investigador@suite.com',
      password: 'investigador123',
    });

    if (authError) {
      console.log('❌ Error en Supabase Auth:', authError.message);
      return;
    }

    if (!authData.user) {
      console.log('❌ No se pudo crear el usuario en Auth');
      return;
    }

    console.log('✅ Usuario creado en Supabase Auth:', authData.user.id);

    // 2. Crear perfil en la tabla users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: 'investigador@suite.com',
          full_name: 'Dr. María González - Investigadora Pampeana',
          role: 'RESEARCHER',
          subscription_plan: 'FREE',
          bio: 'Especialista en arqueología de cazadores-recolectores pampeanos',
          specialties: ['Arqueología Pampeana', 'Cazadores-Recolectores', 'Paleoindio'],
          academic_degree: 'Doctora en Arqueología',
          research_interests: ['Poblamiento temprano', 'Adaptaciones humanas', 'Paleoambiente'],
          professional_affiliations: ['CONICET', 'Universidad Nacional de La Plata']
        }
      ])
      .select()
      .single();

    if (userError) {
      console.log('❌ Error al crear perfil en users:', userError.message);
      return;
    }

    console.log('✅ Usuario RESEARCHER creado exitosamente');
    console.log('📧 Email: investigador@suite.com');
    console.log('🔑 Contraseña: investigador123');
    console.log('👤 Nombre: Dr. María González - Investigadora Pampeana');
    console.log('🎭 Rol: RESEARCHER');
    console.log('🆔 ID:', userData.id);

  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

createResearcherUser(); 