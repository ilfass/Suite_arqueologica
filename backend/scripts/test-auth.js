const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000/api';

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

class AuthTester {
  constructor() {
    this.token = null;
    this.user = null;
  }

  async testHealthCheck() {
    log.title('\n🔍 Probando Health Check...');
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      if (response.data.success) {
        log.success('Health check exitoso');
        log.info(`Servidor: ${response.data.message}`);
        log.info(`Versión: ${response.data.version}`);
        log.info(`Entorno: ${response.data.environment}`);
      } else {
        log.error('Health check falló');
      }
    } catch (error) {
      log.error(`Error en health check: ${error.message}`);
    }
  }

  async testRegistration() {
    log.title('\n📝 Probando Registro...');
    try {
      const userData = {
        email: `test-${Date.now()}@example.com`,
        password: 'TestPassword123!',
        fullName: 'Usuario de Prueba',
        role: 'RESEARCHER'
      };

      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      
      if (response.data.success) {
        this.token = response.data.data.token;
        this.user = response.data.data.user;
        log.success('Registro exitoso');
        log.info(`Usuario: ${this.user.email}`);
        log.info(`Rol: ${this.user.role}`);
        log.info(`Token recibido: ${this.token ? 'Sí' : 'No'}`);
      } else {
        log.error('Registro falló');
      }
    } catch (error) {
      log.error(`Error en registro: ${error.response?.data?.message || error.message}`);
    }
  }

  async testLogin() {
    log.title('\n🔑 Probando Login...');
    try {
      const loginData = {
        email: 'investigador@example.com',
        password: 'TestPassword123!'
      };

      const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
      
      if (response.data.success) {
        this.token = response.data.data.token;
        this.user = response.data.data.user;
        log.success('Login exitoso');
        log.info(`Usuario: ${this.user.email}`);
        log.info(`Rol: ${this.user.role}`);
      } else {
        log.error('Login falló');
      }
    } catch (error) {
      log.error(`Error en login: ${error.response?.data?.message || error.message}`);
    }
  }

  async testGetCurrentUser() {
    log.title('\n👤 Probando Obtener Usuario Actual...');
    if (!this.token) {
      log.warning('No hay token, saltando prueba');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      
      if (response.data.success) {
        log.success('Obtener usuario actual exitoso');
        log.info(`Nombre: ${response.data.data.full_name}`);
        log.info(`Email: ${response.data.data.email}`);
        log.info(`Rol: ${response.data.data.role}`);
      } else {
        log.error('Obtener usuario actual falló');
      }
    } catch (error) {
      log.error(`Error obteniendo usuario: ${error.response?.data?.message || error.message}`);
    }
  }

  async testCreateSite() {
    log.title('\n🏛️ Probando Crear Sitio Arqueológico...');
    if (!this.token) {
      log.warning('No hay token, saltando prueba');
      return;
    }

    try {
      const siteData = {
        name: 'Sitio de Prueba',
        description: 'Sitio arqueológico para pruebas',
        location: {
          latitude: 19.4326,
          longitude: -99.1332,
          address: 'Ciudad de México, México'
        },
        period: 'Test',
        status: 'active'
      };

      const response = await axios.post(`${API_BASE_URL}/sites`, siteData, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      
      if (response.data.success) {
        log.success('Crear sitio exitoso');
        log.info(`ID: ${response.data.data.id}`);
        log.info(`Nombre: ${response.data.data.name}`);
        return response.data.data.id;
      } else {
        log.error('Crear sitio falló');
      }
    } catch (error) {
      log.error(`Error creando sitio: ${error.response?.data?.message || error.message}`);
    }
  }

  async testCreateArtifact(siteId) {
    log.title('\n🏺 Probando Crear Artefacto...');
    if (!this.token || !siteId) {
      log.warning('No hay token o siteId, saltando prueba');
      return;
    }

    try {
      const artifactData = {
        site_id: siteId,
        name: 'Artefacto de Prueba',
        description: 'Artefacto para pruebas',
        artifact_type: 'Cerámica',
        material: 'Arcilla',
        condition: 'Buena'
      };

      const response = await axios.post(`${API_BASE_URL}/artifacts`, artifactData, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      
      if (response.data.success) {
        log.success('Crear artefacto exitoso');
        log.info(`ID: ${response.data.data.id}`);
        log.info(`Nombre: ${response.data.data.name}`);
        log.info(`Tipo: ${response.data.data.artifact_type}`);
      } else {
        log.error('Crear artefacto falló');
      }
    } catch (error) {
      log.error(`Error creando artefacto: ${error.response?.data?.message || error.message}`);
    }
  }

  async testCreateExcavation(siteId) {
    log.title('\n⛏️ Probando Crear Excavación...');
    if (!this.token || !siteId) {
      log.warning('No hay token o siteId, saltando prueba');
      return;
    }

    try {
      const excavationData = {
        site_id: siteId,
        name: 'Excavación de Prueba',
        description: 'Excavación para pruebas',
        start_date: new Date().toISOString().split('T')[0],
        status: 'planned',
        objectives: ['Documentar el sitio', 'Recuperar artefactos'],
        methodology: 'Excavación estratigráfica'
      };

      const response = await axios.post(`${API_BASE_URL}/excavations`, excavationData, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      
      if (response.data.success) {
        log.success('Crear excavación exitoso');
        log.info(`ID: ${response.data.data.id}`);
        log.info(`Nombre: ${response.data.data.name}`);
        log.info(`Estado: ${response.data.data.status}`);
      } else {
        log.error('Crear excavación falló');
      }
    } catch (error) {
      log.error(`Error creando excavación: ${error.response?.data?.message || error.message}`);
    }
  }

  async testUnauthorizedAccess() {
    log.title('\n🚫 Probando Acceso No Autorizado...');
    try {
      await axios.post(`${API_BASE_URL}/sites`, { name: 'Test' });
      log.error('Acceso no autorizado permitido (debería fallar)');
    } catch (error) {
      if (error.response?.status === 401) {
        log.success('Acceso no autorizado correctamente bloqueado');
      } else {
        log.error(`Error inesperado: ${error.message}`);
      }
    }
  }

  async testInvalidToken() {
    log.title('\n🔒 Probando Token Inválido...');
    try {
      await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: 'Bearer invalid-token' }
      });
      log.error('Token inválido aceptado (debería fallar)');
    } catch (error) {
      if (error.response?.status === 401) {
        log.success('Token inválido correctamente rechazado');
      } else {
        log.error(`Error inesperado: ${error.message}`);
      }
    }
  }

  async runAllTests() {
    log.title('🧪 INICIANDO PRUEBAS DE AUTENTICACIÓN');
    log.info(`API Base URL: ${API_BASE_URL}`);

    await this.testHealthCheck();
    await this.testRegistration();
    await this.testLogin();
    await this.testGetCurrentUser();
    
    const siteId = await this.testCreateSite();
    await this.testCreateArtifact(siteId);
    await this.testCreateExcavation(siteId);
    
    await this.testUnauthorizedAccess();
    await this.testInvalidToken();

    log.title('\n🎉 PRUEBAS COMPLETADAS');
    log.info('Revisa los resultados arriba para verificar el funcionamiento del sistema de autenticación.');
  }
}

// Ejecutar las pruebas
const tester = new AuthTester();
tester.runAllTests().catch(error => {
  log.error(`Error ejecutando pruebas: ${error.message}`);
  process.exit(1);
}); 