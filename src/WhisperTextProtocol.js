// src/WhisperTextProtocol.js

const libsignal = require('../mylibsignal'); // Wrapper local
const { Buffer } = require('buffer');
const BaseKeyType = require('./base_key_type');
const {
    LibSignalLoadError,
    StoreImplementationError,
    EncryptionError,
    DecryptionError,
    UnknownMessageTypeError
} = require('./errors');

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

    // 🔐 Cifrar mensaje
    async encryptMessage(plaintext) {
        try {
            const sessionCipher = new libsignal.SessionCipher(this.store, this.userId);
            const ciphertextBuffer = await sessionCipher.encrypt(Buffer.from(plaintext, 'utf-8'));

            return {
                type: SignalMessageType.WHISPER,
                body: Buffer.from(ciphertextBuffer).toString('base64') // Base64 seguro
            };
        } catch (error) {
            console.error(`❌ Error cifrando mensaje para ${this.userId}:`, error.message);
            throw new EncryptionError(error.message);
        }
    }

    // 🔓 Descifrar mensaje
    async decryptMessage(ciphertext) {
        const cipherBuffer = Buffer.isBuffer(ciphertext)
            ? ciphertext
            : Buffer.from(ciphertext, 'base64');

        const sessionCipher = new libsignal.SessionCipher(this.store, this.userId);

        try {
            // El stub avanzado solo tiene decrypt() genérico
            const decrypted = await sessionCipher.decrypt(cipherBuffer);
            return decrypted.toString('utf-8');
        } catch (error) {
            console.error(`❌ Error descifrando mensaje de ${this.userId}:`, error.message);
            throw new DecryptionError(error.message);
        }
    }

    // 🧩 Crear sesión inicial
    async createSession(preKeyBundle) {
        try {
            const sessionBuilder = new libsignal.SessionBuilder(this.store, this.userId);
            await sessionBuilder.build(preKeyBundle); // stub usa build()
            console.log(`🔑 Sesión Signal establecida con ${this.userId}.`);
        } catch (error) {
            console.error(`❌ Error creando sesión para ${this.userId}:`, error.message);
            throw error;
        }
    }
}

module.exports = { WhisperTextProtocol, SignalMessageType, BaseKeyType };
