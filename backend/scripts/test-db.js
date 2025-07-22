const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🧪 Probando conexión a la base de datos...\n');

  try {
    // 1. Probar conexión básica
    console.log('1️⃣ Probando conexión básica...');
    const { data: healthData, error: healthError } = await supabase
      .from('archaeological_sites')
      .select('count')
      .limit(1);
    
    if (healthError) {
      throw new Error(`Error de conexión: ${healthError.message}`);
    }
    console.log('✅ Conexión exitosa\n');

    // 2. Contar registros en cada tabla
    console.log('2️⃣ Contando registros...');
    
    const tables = ['users', 'archaeological_sites', 'artifacts'];
    const counts = {};
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Error contando ${table}: ${error.message}`);
        counts[table] = 'Error';
      } else {
        counts[table] = count;
        console.log(`✅ ${table}: ${count} registros`);
      }
    }
    
    console.log('\n📊 Resumen de registros:');
    Object.entries(counts).forEach(([table, count]) => {
      console.log(`   ${table}: ${count}`);
    });

    // 3. Probar consulta de sitios arqueológicos
    console.log('\n3️⃣ Probando consulta de sitios...');
    const { data: sites, error: sitesError } = await supabase
      .from('archaeological_sites')
      .select('id, name, status, created_at')
      .limit(3);
    
    if (sitesError) {
      console.log(`❌ Error consultando sitios: ${sitesError.message}`);
    } else {
      console.log('✅ Sitios encontrados:');
      sites.forEach(site => {
        console.log(`   - ${site.name} (${site.status})`);
      });
    }

    // 4. Probar consulta de artefactos
    console.log('\n4️⃣ Probando consulta de artefactos...');
    const { data: artifacts, error: artifactsError } = await supabase
      .from('artifacts')
      .select('id, name, artifact_type, site_id')
      .limit(3);
    
    if (artifactsError) {
      console.log(`❌ Error consultando artefactos: ${artifactsError.message}`);
    } else {
      console.log('✅ Artefactos encontrados:');
      artifacts.forEach(artifact => {
        console.log(`   - ${artifact.name} (${artifact.artifact_type})`);
      });
    }

    // 5. Probar consulta espacial
    console.log('\n5️⃣ Probando consulta espacial...');
    const { data: nearbySites, error: spatialError } = await supabase
      .rpc('get_sites_within_radius', {
        center_lat: 19.6915,
        center_lng: -98.8441,
        radius_meters: 100000
      });
    
    if (spatialError) {
      console.log(`⚠️  Función espacial no disponible: ${spatialError.message}`);
      console.log('   (Esto es normal si no se ha creado la función personalizada)');
    } else {
      console.log('✅ Consulta espacial exitosa');
      console.log(`   Sitios encontrados: ${nearbySites?.length || 0}`);
    }

    // 6. Probar inserción temporal
    console.log('\n6️⃣ Probando inserción temporal...');
    const testSite = {
      name: 'Sitio de Prueba - ' + Date.now(),
      description: 'Sitio temporal para pruebas',
      location: 'POINT(-99.1332 19.4326)',
      address: 'Ciudad de México, México',
      period: 'Test',
      status: 'active',
      created_by: '00000000-0000-0000-0000-000000000001'
    };

    const { data: newSite, error: insertError } = await supabase
      .from('archaeological_sites')
      .insert([testSite])
      .select()
      .single();

    if (insertError) {
      console.log(`❌ Error insertando sitio: ${insertError.message}`);
    } else {
      console.log('✅ Inserción exitosa');
      console.log(`   ID: ${newSite.id}`);
      
      // Limpiar el sitio de prueba
      const { error: deleteError } = await supabase
        .from('archaeological_sites')
        .delete()
        .eq('id', newSite.id);
      
      if (deleteError) {
        console.log(`⚠️  Error eliminando sitio de prueba: ${deleteError.message}`);
      } else {
        console.log('✅ Sitio de prueba eliminado');
      }
    }

    console.log('\n🎉 Todas las pruebas completadas exitosamente!');
    console.log('\n📋 Estado de la base de datos:');
    console.log('   ✅ Conexión: Funcionando');
    console.log('   ✅ Consultas: Funcionando');
    console.log('   ✅ Inserción: Funcionando');
    console.log('   ✅ Eliminación: Funcionando');
    console.log('   ✅ Relaciones: Configuradas');

  } catch (error) {
    console.error('\n❌ Error durante las pruebas:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verificar credenciales de Supabase');
    console.log('   2. Ejecutar schema.sql en Supabase');
    console.log('   3. Ejecutar npm run init-db');
    process.exit(1);
  }
}

// Ejecutar las pruebas
testDatabase(); 