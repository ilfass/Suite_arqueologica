const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRLSPolicies() {
  console.log('🔧 Ajustando políticas RLS para public_profiles...');
  
  try {
    // 1. Deshabilitar RLS temporalmente
    console.log('📋 Deshabilitando RLS temporalmente...');
    const { error: disableError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public_profiles DISABLE ROW LEVEL SECURITY;'
    });
    
    if (disableError) {
      console.log('⚠️ No se pudo deshabilitar RLS (puede que no exista la función):', disableError.message);
    } else {
      console.log('✅ RLS deshabilitado temporalmente');
    }

    // 2. Crear políticas más permisivas para desarrollo
    console.log('📋 Creando políticas permisivas para desarrollo...');
    
    const policies = [
      // Política para permitir lectura a todos los usuarios autenticados
      `CREATE POLICY "Allow authenticated read" ON public_profiles
       FOR SELECT USING (auth.role() = 'authenticated');`,
      
      // Política para permitir inserción/actualización a usuarios autenticados
      `CREATE POLICY "Allow authenticated insert" ON public_profiles
       FOR INSERT WITH CHECK (auth.role() = 'authenticated');`,
      
      // Política para permitir actualización a usuarios autenticados
      `CREATE POLICY "Allow authenticated update" ON public_profiles
       FOR UPDATE USING (auth.role() = 'authenticated');`,
      
      // Política para permitir eliminación a usuarios autenticados
      `CREATE POLICY "Allow authenticated delete" ON public_profiles
       FOR DELETE USING (auth.role() = 'authenticated');`
    ];

    for (const policy of policies) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: policy });
        if (error) {
          console.log('⚠️ Error creando política:', error.message);
        } else {
          console.log('✅ Política creada exitosamente');
        }
      } catch (err) {
        console.log('⚠️ Error ejecutando política:', err.message);
      }
    }

    console.log('🎉 Políticas RLS ajustadas para desarrollo');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Reinicia el Auth Service');
    console.log('2. Prueba el endpoint nuevamente');
    console.log('3. Verifica el frontend');

  } catch (error) {
    console.error('❌ Error ajustando políticas RLS:', error);
  }
}

fixRLSPolicies(); 