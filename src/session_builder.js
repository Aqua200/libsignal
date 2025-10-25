import ProtocolAddress from './protocol_address.js';
import { Curve25519 } from './keyhelper.js'; // Importación directa para la funcionalidad que se queda
import { StoreImplementationError, EncryptionError } from './errors.js';


export default class SessionBuilder {
  
  constructor({ store, libsignal, queue }) {
    if (!store || typeof store.loadSession !== 'function') {
      throw new StoreImplementationError("El 'store' proporcionado no es una implementación válida.");
    }
    if (!libsignal || typeof libsignal.SessionBuilder === 'undefined') {
      throw new Error("La dependencia 'libsignal' no fue inyectada o es inválida.");
    }
    if (!queue || typeof queue.add !== 'function') {
      throw new Error("La dependencia 'queue' no fue inyectada o es inválida.");
    }

    this.store = store;
    this.libsignal = libsignal;
    this.queue = queue;
  }


  async createSession(address, preKeyBundle) {
    if (!(address instanceof ProtocolAddress)) {
      throw new TypeError("El parámetro 'address' debe ser una instancia de ProtocolAddress.");
    }

   return this.queue.add(async () => {
      try {
        const addressString = address.toString();
        const sessionBuilder = new this.libsignal.SessionBuilder(this.store, addressString);
        await sessionBuilder.processPreKey(preKeyBundle);
        console.log(`🔑 Sesión Signal establecida exitosamente con ${addressString}`);
      } catch (error) {
        console.error(`❌ Error crítico creando sesión con ${address.toString()}:`, error);
        throw new EncryptionError(`Falló el procesamiento del PreKeyBundle para ${address.toString()}`, error);
      }
    });
  }

  
  async hasSession(address) {
    if (!(address instanceof ProtocolAddress)) {
      return false;
    }
    
    try {
      const sessionExists = await this.store.containsSession(address.toString());
      return sessionExists;
    } catch (error) {
      console.error(`Error verificando la sesión para ${address}:`, error);
      return false;
    }
  }
}
