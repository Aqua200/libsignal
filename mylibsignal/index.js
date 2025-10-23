// mylibsignal/index.js
let libsignal;

try {
  libsignal = await import('libsignal-protocol-javascript');
  console.log('✅ libsignal-protocol-javascript cargado correctamente.');
} catch (error) {
  console.error('🚨 Error al cargar libsignal-protocol-javascript:', error.message);
  console.warn('⚠️ Creando stub temporal para evitar fallos.');

  libsignal = {
    SignalProtocolAddress: class {},
    SessionBuilder: class {
      constructor(store, userId) {
        this.store = store;
        this.userId = userId;
      }
      async build(preKeyBundle) {
        // Stub mínimo
        return preKeyBundle;
      }
      async processPreKey() {
        return true;
      }
    },
    SessionCipher: class {
      constructor(store, userId) {
        this.store = store;
        this.userId = userId;
      }
      async encrypt(buffer) {
        // Retorna mismo buffer como ejemplo
        return buffer;
      }
      async decrypt(buffer) {
        // Retorna mismo buffer como ejemplo
        return buffer;
      }
    },
    KeyHelper: {
      async generateIdentityKeyPair() { return { pubKey: 'stub', privKey: 'stub' }; },
      async generatePreKey() { return { keyId: 1, pubKey: 'stub' }; },
      async generateSignedPreKey() { return { keyId: 1, pubKey: 'stub', signature: 'stub' }; }
    }
  };
}

export default libsignal;
