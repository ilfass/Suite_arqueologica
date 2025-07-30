const puppeteer = require('puppeteer');
const path = require('path');

async function simpleModalTest() {
  console.log('🧪 Test simple del modal...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 }
  });

  try {
    const page = await browser.newPage();
    
    // Crear una página HTML simple con un modal
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Modal</title>
        <style>
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
          .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 500px;
          }
        </style>
      </head>
      <body>
        <button id="openModal">Abrir Modal</button>
        <div id="modal" class="modal" style="display: none;">
          <div class="modal-content">
            <h2>Modal de Prueba</h2>
            <p>Este es un modal de prueba.</p>
            <button id="closeModal">Cerrar</button>
          </div>
        </div>
        
        <script>
          let showModal = false;
          
          document.getElementById('openModal').addEventListener('click', () => {
            console.log('Abriendo modal...');
            showModal = true;
            document.getElementById('modal').style.display = 'flex';
            console.log('Modal abierto, showModal:', showModal);
          });
          
          document.getElementById('closeModal').addEventListener('click', () => {
            console.log('Cerrando modal...');
            showModal = false;
            document.getElementById('modal').style.display = 'none';
            console.log('Modal cerrado, showModal:', showModal);
          });
          
          // Función para verificar el estado
          window.checkModalState = () => {
            return {
              showModal: showModal,
              display: document.getElementById('modal').style.display,
              visible: document.getElementById('modal').offsetParent !== null
            };
          };
        </script>
      </body>
      </html>
    `);
    
    // Habilitar logs de consola
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    console.log('📄 Página HTML cargada');
    
    // Hacer clic en el botón para abrir el modal
    console.log('🖱️ Haciendo clic en Abrir Modal...');
    await page.click('#openModal');
    
    // Esperar un momento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar el estado del modal
    const modalState = await page.evaluate(() => {
      return window.checkModalState();
    });
    
    console.log('Estado del modal:', modalState);
    
    // Verificar si el modal es visible
    const modalVisible = await page.evaluate(() => {
      const modal = document.getElementById('modal');
      return modal && modal.offsetParent !== null;
    });
    
    console.log('Modal visible:', modalVisible);
    
    if (modalVisible) {
      console.log('✅ Modal funciona correctamente!');
      await page.screenshot({ 
        path: path.join(__dirname, '../screenshots/test_findings/simple_modal_working.png'),
        fullPage: true 
      });
    } else {
      console.log('❌ Modal no es visible');
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar la prueba
simpleModalTest().catch(console.error); 