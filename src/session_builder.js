const libsignal = require('../mylibsignal'); // Wrapper local
const ProtocolAddress = require('./protocol_address');
const KeyHelper = require('./keyhelper');
const QueueJob = require('./queue_job');
const {
    EncryptionError,
    DecryptionError,
    UnknownMessageTypeError
} = require('./errors');

/**
 * Clase que maneja la creación de sesiones Signal
 */
class SessionBuilder {
    /**
     * @param {object} store - Implementación de SignalProtocolStore
     */
    constructor(store) {
        if (!store || typeof store.loadSession !== 'function') {
            throw new TypeError("❌ store no implementa SignalProtocolStore correctamente.");
        }

        this.store = store;
        this.queue = new QueueJob(); // Para procesar jobs de sesión secuenciales
    }

    /**
     * Crea una sesión Signal para un contacto
     * @param {ProtocolAddress} address
     * @param {object} preKeyBundle - PreKeyBundle del contacto
     */
    async createSession(address, preKeyBundle) {
        if (!(address instanceof ProtocolAddress)) {
            throw new TypeError("❌ address debe ser instancia de ProtocolAddress");
        }

        this.queue.add(async () => {
            try {
                const sessionBuilder = new libsignal.SessionBuilder(this.store, address.toString());
                await sessionBuilder.processPreKey(preKeyBundle);
                console.log(`🔑 Sesión Signal establecida con ${address.toString()}`);
            } catch (error) {
                console.error(`❌ Error creando sesión con ${address.toString()}:`, error.message);
            }
        });
    }

    /**
     * Retorna true si hay una sesión establecida
     * @param {ProtocolAddress} address
     * @returns {Promise<boolean>}
     */
    async hasSession(address) {
        if (!(address instanceof ProtocolAddress)) return false;
        try {
            const session = await this.store.loadSession(address.toString());
            return !!session;
        } catch {
            return false;
        }
    }

    /**
     * Deriva una clave de sesión compartida usando ECDH Curve25519
     * @param {Buffer} ourPrivateKey
     * @param {Buffer} theirPublicKey
     * @returns {Buffer}
     */
    deriveSharedSecret(ourPrivateKey, theirPublicKey) {
        try {
            return KeyHelper.deriveSharedSecret(ourPrivateKey, theirPublicKey);
        } catch (error) {
            console.error("❌ Error derivando clave compartida:", error.message);
            throw error;
        }
    }
}

module.exports = SessionBuilder;
