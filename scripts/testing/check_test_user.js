require('dotenv').config({ path: '../../backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTestUser() {
    try {
        console.log('🔍 Verificando usuario de prueba...');
        
        // Buscar el usuario en la tabla users
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', 'dr.perez@unam.mx')
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('❌ Usuario no encontrado en tabla users');
                console.log('🔧 Creando usuario en tabla users...');
                
                // Obtener el ID del usuario de Auth
                const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
                
                if (authError) {
                    console.error('❌ Error obteniendo usuarios de Auth:', authError.message);
                    return;
                }

                const authUser = authUsers.users.find(u => u.email === 'dr.perez@unam.mx');
                
                if (!authUser) {
                    console.error('❌ Usuario no encontrado en Auth');
                    return;
                }

                console.log('✅ Usuario encontrado en Auth:', authUser.id);

                // Insertar en tabla users
                const { data: newUser, error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: authUser.id,
                        email: 'dr.perez@unam.mx',
                        role: 'researcher',
                        full_name: 'Dr. Pérez',
                        institution: 'UNAM',
                        phone: '+52 55 1234 5678',
                        is_active: true
                    })
                    .select()
                    .single();

                if (insertError) {
                    console.error('❌ Error insertando en tabla users:', insertError.message);
                    return;
                }

                console.log('✅ Usuario creado en tabla users:', newUser.id);
                console.log('📋 Datos del usuario:');
                console.log('   - ID:', newUser.id);
                console.log('   - Email:', newUser.email);
                console.log('   - Rol:', newUser.role);
                console.log('   - Nombre:', newUser.full_name);
                console.log('   - Institución:', newUser.institution);

            } else {
                console.error('❌ Error verificando usuario:', error.message);
            }
        } else {
            console.log('✅ Usuario encontrado en tabla users');
            console.log('📋 Datos del usuario:');
            console.log('   - ID:', user.id);
            console.log('   - Email:', user.email);
            console.log('   - Rol:', user.role);
            console.log('   - Nombre:', user.full_name);
            console.log('   - Institución:', user.institution);
        }

        console.log('\n🎉 ¡Usuario de prueba listo!');
        console.log('📝 Credenciales de login:');
        console.log('   - Email: dr.perez@unam.mx');
        console.log('   - Password: test123456');

    } catch (error) {
        console.error('❌ Error inesperado:', error.message);
    }
}

checkTestUser(); 