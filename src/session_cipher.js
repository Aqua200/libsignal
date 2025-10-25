import { Buffer } from 'buffer';
import ProtocolAddress from './protocol_address.js';
import {
  EncryptionError,
  DecryptionError,
  UnknownMessageTypeError,
  StoreImplementationError,
} from './errors.js';
import { SignalMessageType } from './WhisperTextProtocol.js'; 


export default class SessionCipher {
  
  constructor({ store, address, libsignal }) {
    if (!store || typeof store.loadSession !== 'function') {
      throw new StoreImplementationError("El 'store' proporcionado no es una implementación válida.");
    }
    if (!(address instanceof ProtocolAddress)) {
      throw new TypeError("El parámetro 'address' debe ser una instancia de ProtocolAddress.");
    }
    if (!libsignal || typeof libsignal.SessionCipher === 'undefined') {
      throw new Error("La dependencia 'libsignal' no fue inyectada o es inválida.");
    }

    this.address = address;
        this.cipher = new libsignal.SessionCipher(store, address.toString());
  }

  
  async encryptMessage(plaintext) {
    try {
      const buffer = Buffer.isBuffer(plaintext) ? plaintext : Buffer.from(plaintext, 'utf-8');
      const ciphertext = await this.cipher.encrypt(buffer);
      
      return {
        type: ciphertext.type, 
        body: Buffer.from(ciphertext.body || '').toString('base64'),
      };
    } catch (error) {
      console.error(`❌ Error cifrando mensaje para ${this.address}:`, error);
      throw new EncryptionError(`Fallo al cifrar para ${this.address}`, error);
    }
  }

  
  async decryptMessage(ciphertext, messageType) {
    const cipherBuffer = Buffer.isBuffer(ciphertext) ? ciphertext : Buffer.from(ciphertext, 'base64');

    try {
      let decryptedBuffer;

       switch (messageType) {
        case SignalMessageType.WHISPER:
          decryptedBuffer = await this.cipher.decryptWhisperMessage(cipherBuffer, 'binary');
          break;
        case SignalMessageType.PRE_KEY_BUNDLE:
          decryptedBuffer = await this.cipher.decryptPreKeyWhisperMessage(cipherBuffer, 'binary');
          break;
        default:
          throw new UnknownMessageTypeError(`Tipo de mensaje no soportado: ${messageType}`);
      }

      return decryptedBuffer.toString('utf-8');
    } catch (error) {
      console.error(`❌ Error descifrando mensaje de ${this.address}:`, error);
      throw new DecryptionError(`Fallo al descifrar un mensaje de ${this.address}`, error);
    }
  }
}
