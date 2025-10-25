import { Buffer } from 'buffer';
import { BaseKeyType } from './base_key_type.js';
class LibSignalLoadError extends Error {}
class StoreImplementationError extends Error {}
class EncryptionError extends Error {}
class DecryptionError extends Error {}
class UnknownMessageTypeError extends Error {}

const SignalMessageType = {
  WHISPER: 1,
  PRE_KEY_BUNDLE: 3
};


class WhisperTextProtocol {
  
  constructor({ userId, store, libsignal, logger = console }) {
    if (!libsignal || typeof libsignal.SessionBuilder === 'undefined') {
      throw new LibSignalLoadError('La librería libsignal no fue inyectada o es inválida.');
    }
    if (!store || typeof store.loadSession !== 'function') {
      throw new StoreImplementationError('El store proporcionado no tiene un método loadSession.');
    }

    this.userId = userId;
    this.store = store;
    this.libsignal = libsignal;
    this.logger = logger;
    this.sessionCipher = new this.libsignal.SessionCipher(this.store, this.userId);
    this.logger.log(`🟣 Protocolo inicializado para ${this.userId}`);
  }


  async encryptMessage(plaintext) {
    try {
      const ciphertextBuffer = await this.sessionCipher.encrypt(Buffer.from(plaintext, 'utf-8'));
      return {
        type: SignalMessageType.WHISPER,
        body: Buffer.from(ciphertextBuffer).toString('base64')
      };
    } catch (error) {
      this.logger.error(`❌ Error cifrando mensaje para ${this.userId}:`, error.message);
      throw new EncryptionError(error.message);
    }
  }

  
  async decryptMessage(ciphertext) {
    const cipherBuffer = Buffer.isBuffer(ciphertext) ? ciphertext : Buffer.from(ciphertext, 'base64');
    
    try {
      const decrypted = await this.sessionCipher.decrypt(cipherBuffer);
      return decrypted.toString('utf-8');
    } catch (error) {
      this.logger.error(`❌ Error descifrando mensaje de ${this.userId}:`, error.message);
      throw new DecryptionError(error.message);
    }
  }


  async createSession(preKeyBundle) {
    try {
      const sessionBuilder = new this.libsignal.SessionBuilder(this.store, this.userId);
      await sessionBuilder.build(preKeyBundle); // O .processPreKey(preKeyBundle) dependiendo de la librería
      this.logger.log(`🔑 Sesión Signal establecida exitosamente con ${this.userId}.`);
    } catch (error) {
      this.logger.error(`❌ Error crítico creando sesión para ${this.userId}:`, error.message);
      // Re-lanza el error original para que la capa superior pueda manejarlo.
      throw error;
    }
  }
}

export {
  WhisperTextProtocol,
  SignalMessageType,
  BaseKeyType,
  LibSignalLoadError,
  StoreImplementationError,
  EncryptionError,
  DecryptionError,
  UnknownMessageTypeError
};
