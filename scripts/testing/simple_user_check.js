require('dotenv').config({ path: '../../backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUsersTable() {
    try {
        console.log('🔍 Verificando tabla users...');
        
        // Intentar consultar la tabla directamente
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (error) {
            console.error('❌ Error accediendo a tabla users:', error.message);
            console.error('📋 Detalles del error:', error);
            return;
        }

        console.log('✅ Tabla users accesible');
        console.log(`📊 Usuarios encontrados: ${users ? users.length : 0}`);

        if (users && users.length > 0) {
            console.log('📋 Ejemplo de usuario:');
            const user = users[0];
            Object.keys(user).forEach(key => {
                console.log(`   - ${key}: ${user[key]}`);
            });
        }

    } catch (error) {
        console.error('❌ Error inesperado:', error.message);
    }
}

checkUsersTable(); 