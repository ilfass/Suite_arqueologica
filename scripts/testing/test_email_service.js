const { EmailService } = require('../backend/src/services/emailService');

async function testEmailService() {
  console.log('🧪 Probando servicio de email...\n');

  try {
    // 1. Probar configuración
    console.log('📋 1. Verificando configuración de email...');
    const configValid = await EmailService.testEmailConfig();
    
    if (configValid) {
      console.log('✅ Configuración de email válida');
    } else {
      console.log('❌ Error en configuración de email');
      return;
    }

    // 2. Probar envío de email
    console.log('\n📧 2. Probando envío de email...');
    const emailSent = await EmailService.sendEmail(
      'fa07fa@gmail.com',
      'Prueba de Email - Suite Arqueológica',
      'Este es un email de prueba para verificar que el servicio funciona correctamente.',
      '<h1>Prueba de Email</h1><p>El servicio de email está funcionando correctamente.</p><p>Fecha: ' + new Date().toLocaleString() + '</p>'
    );

    if (emailSent) {
      console.log('✅ Email enviado exitosamente');
    } else {
      console.log('❌ Error enviando email');
    }

    // 3. Probar estadísticas
    console.log('\n📊 3. Obteniendo estadísticas...');
    const stats = await EmailService.getEmailStats();
    console.log('📈 Estadísticas de email:');
    console.log(`   - Total: ${stats.total}`);
    console.log(`   - Enviados: ${stats.sent}`);
    console.log(`   - Fallidos: ${stats.failed}`);
    console.log(`   - Rebotados: ${stats.bounced}`);

    // 4. Probar email de bienvenida
    console.log('\n👋 4. Probando email de bienvenida...');
    const welcomeSent = await EmailService.sendWelcomeEmail(
      'fa07fa@gmail.com',
      'Usuario de Prueba'
    );

    if (welcomeSent) {
      console.log('✅ Email de bienvenida enviado');
    } else {
      console.log('❌ Error enviando email de bienvenida');
    }

    console.log('\n🎉 ¡Pruebas completadas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar pruebas
testEmailService(); 