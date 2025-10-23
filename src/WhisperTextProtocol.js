// src/WhisperTextProtocol.js
import { Buffer } from 'buffer';
import { BaseKeyType } from './base_key_type.js';
import libsignal from '../mylibsignal/index.js';

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
  constructor(userId, store) {
    if (!libsignal || typeof libsignal.SessionBuilder === 'undefined') {
      throw new LibSignalLoadError();
    }
    if (!store || typeof store.loadSession !== 'function') {
      throw new StoreImplementationError();
    }

    this.userId = userId;
    this.store = store;

    console.log(`🟣 Inicializando protocolo para ${this.userId} — Tipo de clave: ${BaseKeyType.OURS}`);
  }

  async encryptMessage(plaintext) {
    try {
      const sessionCipher = new libsignal.SessionCipher(this.store, this.userId);
      const ciphertextBuffer = await sessionCipher.encrypt(Buffer.from(plaintext, 'utf-8'));

      return {
        type: SignalMessageType.WHISPER,
        body: Buffer.from(ciphertextBuffer).toString('base64')
      };
    } catch (error) {
      console.error(`❌ Error cifrando mensaje para ${this.userId}:`, error.message);
      throw new EncryptionError(error.message);
    }
  }

  async decryptMessage(ciphertext) {
    const cipherBuffer = Buffer.isBuffer(ciphertext) ? ciphertext : Buffer.from(ciphertext, 'base64');
    const sessionCipher = new libsignal.SessionCipher(this.store, this.userId);

    try {
      const decrypted = await sessionCipher.decrypt(cipherBuffer);
      return decrypted.toString('utf-8');
    } catch (error) {
      console.error(`❌ Error descifrando mensaje de ${this.userId}:`, error.message);
      throw new DecryptionError(error.message);
    }
  }

  async createSession(preKeyBundle) {
    try {
      const sessionBuilder = new libsignal.SessionBuilder(this.store, this.userId);
      await sessionBuilder.build(preKeyBundle);
      console.log(`🔑 Sesión Signal establecida con ${this.userId}.`);
    } catch (error) {
      console.error(`❌ Error creando sesión para ${this.userId}:`, error.message);
      throw error;
    }
  }
}

export { WhisperTextProtocol, SignalMessageType, BaseKeyType };
