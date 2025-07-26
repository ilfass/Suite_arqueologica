#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para actualizar un archivo
function updateContextBannerUsage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Patrón 1: ContextBanner con props
    const pattern1 = /<ContextBanner\s+[^>]*\/>/g;
    if (pattern1.test(content)) {
      content = content.replace(pattern1, '<ContextBanner />');
      updated = true;
    }

    // Patrón 2: ContextBanner con props en múltiples líneas
    const pattern2 = /<ContextBanner\s*\n\s*[^>]*\n\s*\/>/g;
    if (pattern2.test(content)) {
      content = content.replace(pattern2, '<ContextBanner />');
      updated = true;
    }

    // Patrón 3: ContextBanner con props y children
    const pattern3 = /<ContextBanner\s+[^>]*>[\s\S]*?<\/ContextBanner>/g;
    if (pattern3.test(content)) {
      content = content.replace(pattern3, '<ContextBanner />');
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Actualizado: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error actualizando ${filePath}:`, error.message);
  }
  return false;
}

// Función para buscar archivos recursivamente
function findTsxFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Función principal
function main() {
  console.log('🔄 Actualizando usos de ContextBanner...');
  
  const frontendDir = path.join(__dirname, '..', 'frontend-web', 'src');
  const tsxFiles = findTsxFiles(frontendDir);
  
  let updatedCount = 0;
  
  for (const file of tsxFiles) {
    if (updateContextBannerUsage(file)) {
      updatedCount++;
    }
  }
  
  console.log(`\n📊 Resumen:`);
  console.log(`- Archivos procesados: ${tsxFiles.length}`);
  console.log(`- Archivos actualizados: ${updatedCount}`);
  console.log(`\n✅ Actualización completada!`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { updateContextBannerUsage, findTsxFiles }; 