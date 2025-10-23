let libsignal;

try {
  // ✅ Carga la versión oficial JS (la más estable y compatible)
  libsignal = require('libsignal-protocol-javascript');
  console.log('✅ libsignal-protocol-javascript cargado correctamente.');
} catch (error) {
  console.error('🚨 Error al cargar libsignal-protocol-javascript:', error.message);
  console.warn('⚠️ Creando stub temporal para evitar fallos.');

  // ⚠️ Fallback mínimo para que el bot no crashee si la librería falla
  libsignal = {
    SignalProtocolAddress: class {},
    SessionBuilder: class {},
    SessionCipher: class {},
    KeyHelper: {
      async generateIdentityKeyPair() {
        return {};
      },
      async generatePreKey() {
        return {};
      },
      async generateSignedPreKey() {
        return {};
      }
    }
  };
}

module.exports = libsignal;
