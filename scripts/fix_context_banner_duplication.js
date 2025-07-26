const fs = require('fs');
const path = require('path');

// Función para procesar un archivo y eliminar ContextBanner duplicado
function fixContextBannerDuplication(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Verificar si el archivo importa ContextBanner
    const hasContextBannerImport = content.includes("import ContextBanner");
    const hasContextBannerUsage = content.includes("<ContextBanner") || content.includes("renderContextBanner");
    
    if (hasContextBannerImport && hasContextBannerUsage) {
      console.log(`🔧 Procesando: ${filePath}`);
      
      // Eliminar importación de ContextBanner
      content = content.replace(/import\s+ContextBanner\s+from\s+['"][^'"]*ContextBanner['"];?\s*\n?/g, '');
      
      // Eliminar uso directo de ContextBanner
      content = content.replace(/<ContextBanner\s*\/?>\s*\n?/g, '');
      
      // Eliminar funciones renderContextBanner y sus llamadas
      content = content.replace(/const\s+renderContextBanner\s*=\s*\(\)\s*=>\s*\([\s\S]*?\);?\s*\n?/g, '');
      content = content.replace(/\{\s*renderContextBanner\(\)\s*\}\s*\n?/g, '');
      
      // Limpiar líneas vacías múltiples
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      
      fs.writeFileSync(filePath, content, 'utf8');
      modified = true;
      console.log(`✅ Corregido: ${filePath}`);
    }
    
    return modified;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

// Función para encontrar y procesar todos los archivos .tsx en el directorio del investigador
function processResearcherPages() {
  const researcherDir = path.join(__dirname, '../frontend-web/src/app/dashboard/researcher');
  const filesToProcess = [];
  
  function findTsxFiles(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findTsxFiles(fullPath);
      } else if (item.endsWith('.tsx') && item !== 'layout.tsx') {
        filesToProcess.push(fullPath);
      }
    }
  }
  
  findTsxFiles(researcherDir);
  
  console.log(`📁 Encontrados ${filesToProcess.length} archivos .tsx para procesar`);
  
  let fixedCount = 0;
  for (const file of filesToProcess) {
    if (fixContextBannerDuplication(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n🎯 Resumen:`);
  console.log(`📊 Archivos procesados: ${filesToProcess.length}`);
  console.log(`✅ Archivos corregidos: ${fixedCount}`);
  console.log(`📝 Archivos sin cambios: ${filesToProcess.length - fixedCount}`);
}

// Ejecutar el script
console.log('🔧 Iniciando corrección de duplicación de ContextBanner...\n');
processResearcherPages();
console.log('\n✨ Proceso completado!'); 