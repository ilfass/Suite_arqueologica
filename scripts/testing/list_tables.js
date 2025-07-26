require('dotenv').config({ path: '../../backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listTables() {
    try {
        console.log('🔍 Listando tablas disponibles...');
        
        // Intentar diferentes enfoques para listar tablas
        const tables = [
            'users',
            'archaeological_sites',
            'objects',
            'excavations',
            'projects',
            'researchers',
            'email_config',
            'email_logs',
            'spatial_ref_sys'
        ];

        console.log('📋 Verificando tablas conocidas:');
        for (const tableName of tables) {
            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .limit(1);

                if (error) {
                    console.log(`   ❌ ${tableName}: ${error.message}`);
                } else {
                    console.log(`   ✅ ${tableName}: Accesible`);
                }
            } catch (err) {
                console.log(`   ❌ ${tableName}: ${err.message}`);
            }
        }

    } catch (error) {
        console.error('❌ Error inesperado:', error.message);
    }
}

listTables(); 