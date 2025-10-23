const libsignal = require('../mylibsignal'); // Wrapper local
const ProtocolAddress = require('./protocol_address');
const KeyHelper = require('./keyhelper');
const {
    EncryptionError,
    DecryptionError,
    UnknownMessageTypeError
} = require('./errors');

/**
 * Clase para cifrar y descifrar mensajes de sesión Signal
 */
class SessionCipher {
    /**
     * @param {object} store - Implementación de SignalProtocolStore
     * @param {ProtocolAddress} address - Dirección del contacto
     */
    constructor(store, address) {
        if (!store || typeof store.loadSession !== 'function') {
            throw new TypeError("❌ store no implementa SignalProtocolStore correctamente.");
        }
        if (!(address instanceof ProtocolAddress)) {
            throw new TypeError("❌ address debe ser instancia de ProtocolAddress");
        }

        this.store = store;
        this.address = address;
        this.sessionCipher = new libsignal.SessionCipher(store, address.toString());
    }

    /**
     * Cifra un mensaje de texto
     * @param {string|Buffer} plaintext
     * @returns {Promise<{type: number, body: string}>} body en Base64
     */
    async encryptMessage(plaintext) {
        try {
            const buffer = Buffer.isBuffer(plaintext) ? plaintext : Buffer.from(plaintext, 'utf-8');
            const ciphertext = await this.sessionCipher.encrypt(buffer);
            return {
                type: ciphertext.type,
                body: Buffer.from(ciphertext.body || []).toString('base64')
            };
        } catch (error) {
            console.error(`❌ Error cifrando mensaje para ${this.address.toString()}:`, error.message);
            throw new EncryptionError(error.message);
        }
    }

    /**
     * Descifra un mensaje recibido
     * @param {string|Buffer} ciphertext
     * @param {number} messageType - SignalMessageType (WHISPER o PRE_KEY_BUNDLE)
     * @returns {Promise<string>}
     */
    async decryptMessage(ciphertext, messageType) {
        const cipherBuffer = Buffer.isBuffer(ciphertext) ? ciphertext : Buffer.from(ciphertext, 'base64');

        try {
            let decryptedBuffer;

            if (messageType === 1) { // WHISPER
                decryptedBuffer = await this.sessionCipher.decryptWhisperMessage(cipherBuffer, 'binary');
            } else if (messageType === 3) { // PRE_KEY_BUNDLE
                decryptedBuffer = await this.sessionCipher.decryptPreKeyWhisperMessage(cipherBuffer, 'binary');
            } else {
                throw new UnknownMessageTypeError();
            }

            return decryptedBuffer.toString('utf-8');
        } catch (error) {
            console.error(`❌ Error descifrando mensaje de ${this.address.toString()}:`, error.message);
            throw new DecryptionError(error.message);
        }
    }
}

module.exports = SessionCipher;
