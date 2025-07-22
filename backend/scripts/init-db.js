const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initializeDatabase() {
  console.log('🚀 Inicializando base de datos...');

  try {
    // Insertar usuarios de ejemplo
    console.log('📝 Insertando usuarios de ejemplo...');
    
    const users = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@suite-arqueologica.com',
        full_name: 'Administrador Sistema',
        role: 'COORDINATOR',
        subscription_plan: 'INSTITUTIONAL'
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        email: 'investigador@example.com',
        full_name: 'Dr. María González',
        role: 'RESEARCHER',
        subscription_plan: 'PROFESSIONAL'
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        email: 'estudiante@example.com',
        full_name: 'Carlos Rodríguez',
        role: 'STUDENT',
        subscription_plan: 'FREE'
      }
    ];

    for (const user of users) {
      const { error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error inserting user ${user.email}:`, error);
      } else {
        console.log(`✅ Usuario ${user.email} insertado/actualizado`);
      }
    }

    // Insertar sitios arqueológicos de ejemplo
    console.log('🏛️ Insertando sitios arqueológicos de ejemplo...');
    
    const sites = [
      {
        name: 'Teotihuacán',
        description: 'Antigua ciudad mesoamericana, una de las más grandes del mundo prehispánico',
        location: 'POINT(-98.8441 19.6915)',
        address: 'Teotihuacán, Estado de México, México',
        period: 'Clásico',
        status: 'active',
        site_type: 'Ciudad',
        excavation_status: 'En curso',
        preservation_status: 'Excelente',
        created_by: '00000000-0000-0000-0000-000000000001'
      },
      {
        name: 'Machu Picchu',
        description: 'Ciudad inca en los Andes peruanos, Patrimonio de la Humanidad',
        location: 'POINT(-72.5449 -13.1631)',
        address: 'Cusco, Perú',
        period: 'Inca',
        status: 'active',
        site_type: 'Ciudad',
        excavation_status: 'Completada',
        preservation_status: 'Excelente',
        created_by: '00000000-0000-0000-0000-000000000002'
      },
      {
        name: 'Chichen Itza',
        description: 'Importante centro ceremonial maya en la península de Yucatán',
        location: 'POINT(-88.5686 20.6843)',
        address: 'Yucatán, México',
        period: 'Clásico Tardío',
        status: 'active',
        site_type: 'Centro Ceremonial',
        excavation_status: 'Parcial',
        preservation_status: 'Buena',
        created_by: '00000000-0000-0000-0000-000000000001'
      }
    ];

    for (const site of sites) {
      const { error } = await supabase
        .from('archaeological_sites')
        .upsert(site, { onConflict: 'name' });
      
      if (error) {
        console.error(`Error inserting site ${site.name}:`, error);
      } else {
        console.log(`✅ Sitio ${site.name} insertado/actualizado`);
      }
    }

    // Obtener los IDs de los sitios para insertar artefactos
    const { data: siteData } = await supabase
      .from('archaeological_sites')
      .select('id, name');

    if (siteData && siteData.length > 0) {
      console.log('🏺 Insertando artefactos de ejemplo...');
      
      const artifacts = [
        {
          site_id: siteData[0].id, // Teotihuacán
          name: 'Máscara de Jade',
          description: 'Máscara ceremonial de jade con incrustaciones de obsidiana',
          artifact_type: 'Máscara',
          material: 'Jade',
          dimensions: JSON.stringify({ length: 15, width: 12, height: 8 }),
          condition: 'Excelente',
          catalog_number: 'TEO-001',
          created_by: '00000000-0000-0000-0000-000000000002'
        },
        {
          site_id: siteData[0].id, // Teotihuacán
          name: 'Vasija Cerámica',
          description: 'Vasija ceremonial con decoración geométrica',
          artifact_type: 'Cerámica',
          material: 'Arcilla',
          dimensions: JSON.stringify({ height: 25, diameter: 18 }),
          condition: 'Buena',
          catalog_number: 'TEO-002',
          created_by: '00000000-0000-0000-0000-000000000002'
        },
        {
          site_id: siteData[1].id, // Machu Picchu
          name: 'Piedra Intihuatana',
          description: 'Reloj solar ceremonial inca',
          artifact_type: 'Instrumento Astronómico',
          material: 'Granito',
          dimensions: JSON.stringify({ height: 120, width: 80, depth: 60 }),
          condition: 'Excelente',
          catalog_number: 'MP-001',
          created_by: '00000000-0000-0000-0000-000000000001'
        }
      ];

      for (const artifact of artifacts) {
        const { error } = await supabase
          .from('artifacts')
          .insert(artifact);
        
        if (error) {
          console.error(`Error inserting artifact ${artifact.name}:`, error);
        } else {
          console.log(`✅ Artefacto ${artifact.name} insertado`);
        }
      }
    }

    console.log('🎉 Base de datos inicializada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - ${users.length} usuarios insertados`);
    console.log(`   - ${sites.length} sitios arqueológicos insertados`);
    console.log(`   - ${artifacts.length} artefactos insertados`);

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar la inicialización
initializeDatabase(); 