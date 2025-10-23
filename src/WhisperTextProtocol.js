// src/WhisperTextProtocol.js
const libsignal = require('libsignal');
const { Buffer } = require('buffer');
const BaseKeyType = require('./base_key_type');

const SignalMessageType = {
    WHISPER: 1,
    PRE_KEY_BUNDLE: 3
};

class WhisperTextProtocol {
    constructor(userId, store) {
        if (!libsignal || typeof libsignal.SessionBuilder === 'undefined') {
            throw new Error("🚨 'libsignal' no se ha cargado correctamente.");
        }
        if (!store || typeof store.loadSession !== 'function') {
            throw new Error("⚠️ 'store' no implementa correctamente SignalProtocolStore.");
        }
        this.userId = userId;
        this.store = store;
        console.log(`Inicializando protocolo para ${this.userId} — Tipo de clave: ${BaseKeyType.OURS}`);
    }

    async encryptMessage(plaintext) {
        try {
            const sessionCipher = new libsignal.SessionCipher(this.store, this.userId);
            const ciphertext = await sessionCipher.encrypt(Buffer.from(plaintext, 'utf-8'));
            return {
                type: ciphertext.type,
                body: Buffer.from(ciphertext.body)
            };
        } catch (error) {
            console.error(`❌ Error cifrando mensaje para ${this.userId}:`, error.message);
            throw error;
        }
    }

    async decryptMessage(ciphertext, messageType) {
        const cipherBuffer = Buffer.isBuffer(ciphertext) ? ciphertext : Buffer.from(ciphertext, 'base64');
        const sessionCipher = new libsignal.SessionCipher(this.store, this.userId);
        try {
            const decryptedBuffer =
                messageType === SignalMessageType.PRE_KEY_BUNDLE
                    ? await sessionCipher.decryptPreKeyWhisperMessage(cipherBuffer, 'binary')
                    : await sessionCipher.decryptWhisperMessage(cipherBuffer, 'binary');

            return decryptedBuffer.toString('utf-8');
        } catch (error) {
            console.error(`❌ Error descifrando mensaje de ${this.userId}:`, error.message);
            throw error;
        }
    }

    async createSession(preKeyBundle) {
        const sessionBuilder = new libsignal.SessionBuilder(this.store, this.userId);
        await sessionBuilder.processPreKey(preKeyBundle);
        console.log(`🔑 Sesión Signal establecida con ${this.userId}.`);
    }
}

module.exports = { WhisperTextProtocol, SignalMessageType, BaseKeyType };
