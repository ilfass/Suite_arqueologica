require('dotenv').config({ path: '../../backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
    try {
        console.log('🔧 Creando usuario de prueba...');
        
        // Datos del usuario de prueba
        const testUser = {
            email: 'dr.perez@unam.mx',
            password: 'test123456',
            role: 'researcher',
            full_name: 'Dr. Pérez',
            institution: 'UNAM',
            phone: '+52 55 1234 5678'
        };

        // 1. Crear usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: testUser.email,
            password: testUser.password,
            email_confirm: true
        });

        if (authError) {
            console.error('❌ Error creando usuario en Auth:', authError.message);
            return;
        }

        console.log('✅ Usuario creado en Auth:', authData.user.id);

        // 2. Insertar en tabla users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email: testUser.email,
                role: testUser.role,
                full_name: testUser.full_name,
                institution: testUser.institution,
                phone: testUser.phone,
                is_active: true
            })
            .select()
            .single();

        if (userError) {
            console.error('❌ Error insertando en tabla users:', userError.message);
            return;
        }

        console.log('✅ Usuario insertado en tabla users:', userData.id);

        // 3. Verificar que el usuario existe
        const { data: verifyData, error: verifyError } = await supabase
            .from('users')
            .select('*')
            .eq('email', testUser.email)
            .single();

        if (verifyError) {
            console.error('❌ Error verificando usuario:', verifyError.message);
            return;
        }

        console.log('✅ Usuario verificado correctamente');
        console.log('📋 Datos del usuario:');
        console.log('   - ID:', verifyData.id);
        console.log('   - Email:', verifyData.email);
        console.log('   - Rol:', verifyData.role);
        console.log('   - Nombre:', verifyData.full_name);
        console.log('   - Institución:', verifyData.institution);

        console.log('\n🎉 ¡Usuario de prueba creado exitosamente!');
        console.log('📝 Credenciales de login:');
        console.log('   - Email: dr.perez@unam.mx');
        console.log('   - Password: test123456');

    } catch (error) {
        console.error('❌ Error inesperado:', error.message);
    }
}

createTestUser(); 