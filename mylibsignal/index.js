let libsignal;

try {
  libsignal = require('libsignal-protocol-javascript');
  console.log('✅ libsignal-protocol-javascript cargado correctamente.');
} catch (error) {
  console.error('🚨 Error al cargar libsignal-protocol-javascript:', error.message);
  console.warn('⚠️ Usando stub temporal de libsignal para evitar fallos.');

  // Crea un mock básico (solo para que no crashee)
  libsignal = {
    SignalProtocolAddress: class {},
    SessionBuilder: class {},
    SessionCipher: class {},
    KeyHelper: {
      generateIdentityKeyPair: async () => ({}),
      generatePreKey: async () => ({}),
      generateSignedPreKey: async () => ({})
    }
  };
}

module.exports = libsignal;
