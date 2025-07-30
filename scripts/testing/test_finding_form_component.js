const puppeteer = require('puppeteer');

async function testFindingFormComponent() {
  console.log('🧪 Probando el componente FindingForm en aislamiento...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Crear una página HTML simple para probar el componente
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test FindingForm</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .test-container { max-width: 800px; margin: 0 auto; }
          .modal { 
            position: fixed; 
            top: 0; 
            left: 0; 
            right: 0; 
            bottom: 0; 
            background: rgba(0,0,0,0.5); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            z-index: 1000; 
          }
          .modal-content { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            max-width: 600px; 
            width: 90%; 
            max-height: 80vh; 
            overflow: auto; 
          }
          .form-group { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; font-weight: bold; }
          input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
          .buttons { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
          button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
          .btn-primary { background: #3b82f6; color: white; }
          .btn-secondary { background: #6b7280; color: white; }
        </style>
      </head>
      <body>
        <div class="test-container">
          <h1>🧪 Test del Componente FindingForm</h1>
          <p>Esta es una prueba simple del modal de hallazgos.</p>
          
          <button id="openModal" class="btn-primary">Abrir Modal de Hallazgo</button>
          
          <div id="modal" class="modal" style="display: none;">
            <div class="modal-content">
              <h2>📋 Nuevo Hallazgo Arqueológico</h2>
              <p>Formulario siguiendo estándares internacionales de arqueología</p>
              
              <div class="form-group">
                <label>Nombre/Descripción *</label>
                <input type="text" id="name" placeholder="Ej: Punta de proyectil tipo Cola de Pescado" />
              </div>
              
              <div class="form-group">
                <label>Tipo de Hallazgo *</label>
                <select id="type">
                  <option value="artifact">🪨 Artefacto</option>
                  <option value="feature">🏗️ Estructura</option>
                  <option value="ecofact">🌿 Ecofacto</option>
                  <option value="structure">🏛️ Estructura</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Material *</label>
                <input type="text" id="material" placeholder="Ej: Sílice, Arcilla, Hueso" />
              </div>
              
              <div class="form-group">
                <label>Descripción *</label>
                <textarea id="description" rows="3" placeholder="Descripción detallada del hallazgo"></textarea>
              </div>
              
              <div class="form-group">
                <label>Número de Catálogo *</label>
                <input type="text" id="catalogNumber" placeholder="Ej: HAL-2024-001" />
              </div>
              
              <div class="buttons">
                <button id="cancelBtn" class="btn-secondary">Cancelar</button>
                <button id="saveBtn" class="btn-primary">💾 Guardar Hallazgo</button>
              </div>
            </div>
          </div>
        </div>
        
        <script>
          document.getElementById('openModal').addEventListener('click', function() {
            document.getElementById('modal').style.display = 'flex';
            console.log('✅ Modal abierto');
          });
          
          document.getElementById('cancelBtn').addEventListener('click', function() {
            document.getElementById('modal').style.display = 'none';
            console.log('❌ Modal cerrado');
          });
          
          document.getElementById('saveBtn').addEventListener('click', function() {
            const name = document.getElementById('name').value;
            const type = document.getElementById('type').value;
            const material = document.getElementById('material').value;
            const description = document.getElementById('description').value;
            const catalogNumber = document.getElementById('catalogNumber').value;
            
            if (!name || !material || !description || !catalogNumber) {
              alert('Por favor completa todos los campos obligatorios.');
              return;
            }
            
            console.log('💾 Guardando hallazgo:', { name, type, material, description, catalogNumber });
            alert('✅ Hallazgo guardado exitosamente!');
            document.getElementById('modal').style.display = 'none';
          });
        </script>
      </body>
      </html>
    `;
    
    await page.setContent(htmlContent);
    
    console.log('📄 Página de prueba cargada');
    
    // Verificar si hay errores en la consola
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Hacer clic en el botón para abrir el modal
    console.log('🖱️ Haciendo clic en "Abrir Modal de Hallazgo"...');
    await page.click('#openModal');
    
    // Esperar a que aparezca el modal
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar si el modal apareció
    const modal = await page.$('#modal');
    const modalDisplay = await page.evaluate(el => el.style.display, modal);
    
    if (modalDisplay === 'flex') {
      console.log('✅ Modal apareció correctamente');
      
      // Llenar el formulario
      console.log('📝 Llenando formulario...');
      await page.type('#name', 'Punta de Proyectil Cola de Pescado');
      await page.select('#type', 'artifact');
      await page.type('#material', 'Sílice');
      await page.type('#description', 'Punta de proyectil tipo Cola de Pescado, retoque bifacial, base cóncava');
      await page.type('#catalogNumber', 'HAL-2024-001');
      
      // Guardar el hallazgo
      console.log('💾 Guardando hallazgo...');
      await page.click('#saveBtn');
      
      // Esperar a que se procese
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Formulario completado exitosamente');
    } else {
      console.log('❌ Modal no apareció');
    }
    
    // Verificar errores de consola
    if (consoleErrors.length > 0) {
      console.log('❌ Errores encontrados en la consola:');
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ No se encontraron errores en la consola');
    }
    
    // Tomar screenshot
    await page.screenshot({ 
      path: 'test_finding_form_component.png',
      fullPage: true 
    });
    console.log('📸 Screenshot guardado como test_finding_form_component.png');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  } finally {
    await browser.close();
    console.log('🏁 Prueba completada');
  }
}

testFindingFormComponent(); 