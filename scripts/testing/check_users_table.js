require('dotenv').config({ path: '../../backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUsersTable() {
    try {
        console.log('🔍 Verificando estructura de tabla users...');
        
        // Verificar si la tabla existe
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .eq('table_name', 'users');

        if (tablesError) {
            console.error('❌ Error verificando tabla:', tablesError.message);
            return;
        }

        console.log('✅ Tabla users existe:', tables.length > 0);

        // Verificar estructura de columnas
        const { data: columns, error: columnsError } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type, is_nullable')
            .eq('table_schema', 'public')
            .eq('table_name', 'users')
            .order('ordinal_position');

        if (columnsError) {
            console.error('❌ Error verificando columnas:', columnsError.message);
            return;
        }

        console.log('📋 Estructura de la tabla users:');
        columns.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });

        // Verificar datos existentes
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(5);

        if (usersError) {
            console.error('❌ Error consultando usuarios:', usersError.message);
            return;
        }

        console.log(`📊 Usuarios existentes: ${users.length}`);
        users.forEach(user => {
            console.log(`   - ${user.email} (${user.role})`);
        });

    } catch (error) {
        console.error('❌ Error inesperado:', error.message);
    }
}

checkUsersTable(); 