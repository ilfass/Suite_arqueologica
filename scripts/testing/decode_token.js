const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './backend/.env' });

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE5ODI0MzQzLTNiNDUtNDM2MC04MzNjLThmMjQxZjdkODM1ZCIsImVtYWlsIjoibGljLmZhYmlhbmRlQGdtYWlsLmNvbSIsInJvbGUiOiJSRVNFQVJDSEVSIiwiZnVsbE5hbWUiOiJGYWJpYW4gZGUgSGFybyIsImlhdCI6MTc1Mzg0NTgyMCwiZXhwIjoxNzUzOTMyMjIwfQ.Chers3CReEXOvWRHGj_hjoeYhp4QWT1Elj2ycETiSzM';

console.log('🔧 Debug - JWT_SECRET:', process.env.JWT_SECRET ? 'Presente' : 'Ausente');

try {
  // Decodificar sin verificar
  const decodedWithoutVerify = jwt.decode(token);
  console.log('🔍 Token decodificado sin verificar:', decodedWithoutVerify);
  
  // Verificar con JWT_SECRET
  const decodedWithVerify = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  console.log('🔍 Token verificado:', decodedWithVerify);
  
} catch (error) {
  console.error('❌ Error al verificar token:', error.message);
} 