// src/WhisperTextProtocol.js

const libsignal = require('libsignal'); // Asume que tu wrapper local ('mylibsignal') está funcionando.
const { Buffer } = require('buffer'); 

// 🛑 IMPORTAR EL ARCHIVO DE CONSTANTES BASE_KEY_TYPE 🛑
// Asume que este archivo está en el mismo directorio (src/)
const BaseKeyType = require('./base_key_type'); 

// Constantes para los tipos de mensajes Signal
const SignalMessageType = {
    WHISPER: 1,      // Mensaje cifrado normal
    PRE_KEY_BUNDLE: 3 // Mensaje usado para iniciar una nueva sesión
};

/**
 * @class WhisperTextProtocol
 * @description Clase central para interactuar con la criptografía de Signal Protocol.
 */
class WhisperTextProtocol {
    /**
     * @param {string} userId - El JID (user@s.whatsapp.net) del contacto remoto.
     * @param {object} store - La tienda de protocolo que implementa SignalProtocolStore.
     */
    constructor(userId, store) {
        if (!libsignal || typeof libsignal.SessionBuilder === 'undefined') {
            throw new Error("🚨 Error: La librería 'libsignal' no se ha cargado correctamente. Verifica tu instalación.");
        }
        this.userId = userId;
        this.store = store;

        // Se puede usar BaseKeyType aquí, por ejemplo, al inicializar la tienda
        console.log(`Inicializando protocolo para ${this.userId}. Nuestro tipo de clave: ${BaseKeyType.OURS}`);
    }

    /**
     * @description Cifra un mensaje de texto.
     * @param {string} plaintext - El mensaje a cifrar.
     * @returns {Promise<Buffer>} Un buffer del mensaje cifrado serializado.
     */
    async encryptMessage(plaintext) {
        try {
            const sessionCipher = new libsignal.SessionCipher(this.store, this.userId);
            const ciphertext = await sessionCipher.encrypt(Buffer.from(plaintext, 'utf-8'));
            
            // Serializa el resultado para el envío por la red
            return Buffer.from(ciphertext.serialize());
        } catch (error) {
            console.error(`❌ Error de cifrado para ${this.userId}:`, error.message);
            throw error;
        }
    }

    /**
     * @description Descifra un mensaje cifrado recibido.
     * @param {Buffer | string} ciphertext - El mensaje cifrado.
     * @param {number} messageType - Tipo de mensaje (1 para WHISPER, 3 para PRE_KEY_BUNDLE).
     * @returns {Promise<string>} El mensaje de texto descifrado.
     */
    async decryptMessage(ciphertext, messageType) {
        const cipherBuffer = Buffer.isBuffer(ciphertext) ? ciphertext : Buffer.from(ciphertext, 'base64');
        const sessionCipher = new libsignal.SessionCipher(this.store, this.userId);
        
        let decryptedBuffer;
        try {
            if (messageType === SignalMessageType.PRE_KEY_BUNDLE) {
                decryptedBuffer = await sessionCipher.decryptPreKeyWhisperMessage(cipherBuffer);
            } else if (messageType === SignalMessageType.WHISPER) {
                decryptedBuffer = await sessionCipher.decryptWhisperMessage(cipherBuffer);
            } else {
                throw new Error(`Tipo de mensaje Signal desconocido: ${messageType}`);
            }

            return decryptedBuffer.toString('utf-8');

        } catch (error) {
            console.error(`❌ Error crítico de descifrado para ${this.userId}:`, error.message);
            throw error; 
        }
    }

    /**
     * @description Inicia una nueva sesión Signal procesando el PreKeyBundle del contacto.
     * @param {object} preKeyBundle - El paquete de claves públicas del destinatario.
     * @returns {Promise<void>}
     */
    async createSession(preKeyBundle) {
        const sessionBuilder = new libsignal.SessionBuilder(this.store, this.userId);
        
        await sessionBuilder.processPreKey(preKeyBundle);
        console.log(`🔑 Sesión Signal establecida con ${this.userId}.`);
    }
}

module.exports = { 
    WhisperTextProtocol, 
    SignalMessageType,
    BaseKeyType // Opcional: Re-exportamos BaseKeyType para otros módulos que puedan necesitarlo
};
