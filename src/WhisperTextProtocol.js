

const libsignal = require('libsignal'); // Importa la librería Signal (tu wrapper o fork)


class WhisperTextProtocol {
    
    constructor(userId, store) {
        if (!libsignal) {
            throw new Error("La librería 'libsignal' no está disponible. Asegúrate de que esté instalada correctamente.");
        }
        this.userId = userId;
        this.store = store;
        this.sessionBuilder = new libsignal.SessionBuilder(store, userId);
    }

    
    async encryptMessage(plaintext) {
                const sessionCipher = new libsignal.SessionCipher(this.store, this.userId);
        
                const ciphertext = await sessionCipher.encrypt(Buffer.from(plaintext, 'utf-8'));
        
                return {
            type: ciphertext.type, // 3 (PRE_KEY_BUNDLE), 1 (WHISPER), etc.
            body: Buffer.from(ciphertext.serialize()).toString('base64')
        };
    }

    async decryptMessage(ciphertext, messageType) {
                const sessionCipher = new libsignal.SessionCipher(this.store, this.userId);
        
        let decryptedData;
        try {
            if (messageType === 3) { // Mensaje de PreKey (para iniciar sesión)
                decryptedData = await sessionCipher.decryptPreKeyWhisperMessage(ciphertext);
            } else if (messageType === 1) { // Mensaje normal de Whisper
                decryptedData = await sessionCipher.decryptWhisperMessage(ciphertext);
            } else {
                throw new Error(`Tipo de mensaje desconocido: ${messageType}`);
            }

            // 2. Devolver el texto
            return Buffer.from(decryptedData).toString('utf-8');

        } catch (error) {
            console.error(`Error al descifrar mensaje de ${this.userId}:`, error.message);
            // Manejo de errores criptográficos: puede indicar una clave perdida o reseteada.
            throw new Error("Fallo en la sincronización de la clave de sesión.");
        }
    }

    /**
     * @description Inicia una nueva sesión Signal para un destinatario, 
     * descargando su paquete de claves (PreKeyBundle).
     * @param {PreKeyBundle} preKeyBundle - El paquete de claves públicas del destinatario.
     * @returns {Promise<void>}
     */
    async createSession(preKeyBundle) {
        // Este método usa el SessionBuilder para construir la sesión
        await this.sessionBuilder.processPreKey(preKeyBundle);
        console.log(`Sesión Signal creada con ${this.userId}.`);
    }
}

module.exports = WhisperTextProtocol;
