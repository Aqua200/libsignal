let libsignal;

try {
    libsignal = await import('libsignal-protocol-javascript');
  console.log('✅ libsignal-protocol-javascript cargado correctamente.');

} catch (error) {
  console.error('================================================================');
  console.error('🚨 ERROR CRÍTICO: No se pudo cargar la librería de cifrado.');
  console.error('🚨 La aplicación no puede funcionar de manera segura sin este módulo.');
  console.error('----------------------------------------------------------------');
  console.error('Detalles del error:', error.message);
  console.error('Por favor, asegúrate de que "libsignal-protocol-javascript" esté correctamente instalado.');
  console.error('================================================================');

    process.exit(1);
}

export default libsignal;
