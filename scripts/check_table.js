const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avpaiyyjixtdopbciedr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cGFpeXlqaXh0ZG9wYmNpZWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODY2MDMyMywiZXhwIjoyMDY0MjM2MzIzfQ.jb6t6O2-c0SHv5WAw4F7u93dbGrZ8TKh0UTNzcNEOhc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  console.log('🔍 Verificando tabla public_profiles...');
  
  try {
    // Intentar consultar la tabla
    const { data, error } = await supabase
      .from('public_profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Tabla no existe o error:', error.message);
      return false;
    } else {
      console.log('✅ Tabla public_profiles existe');
      return true;
    }
  } catch (error) {
    console.error('❌ Error verificando tabla:', error);
    return false;
  }
}

checkTable(); 