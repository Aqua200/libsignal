const { generateNumericFingerprint } = require('./numeric_fingerprint');
const ProtocolAddress = require('./protocol_address');

/**
 * Clase que representa un registro de sesión Signal
 */
class SessionRecord {
    /**
     * @param {ProtocolAddress} address - Dirección del contacto
     * @param {Buffer} identityKey - Clave pública del contacto
     * @param {Buffer} ourBaseKey - Nuestra clave base
     * @param {object} sessionState - Estado interno de la sesión (objeto serializable)
     */
    constructor(address, identityKey, ourBaseKey, sessionState = {}) {
        if (!(address instanceof ProtocolAddress)) {
            throw new TypeError("❌ address debe ser instancia de ProtocolAddress");
        }
        if (!Buffer.isBuffer(identityKey) || !Buffer.isBuffer(ourBaseKey)) {
            throw new TypeError("❌ identityKey y ourBaseKey deben ser Buffers");
        }

        this.address = address;
        this.identityKey = identityKey;
        this.ourBaseKey = ourBaseKey;
        this.sessionState = sessionState;

        // Fingerprint numérico para verificación de seguridad
        this.fingerprint = generateNumericFingerprint(identityKey);

        // Timestamp de creación / última actualización
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
    }

    /**
     * Actualiza el estado de la sesión
     * @param {object} newState
     */
    updateSessionState(newState) {
        this.sessionState = newState;
        this.updatedAt = Date.now();
    }

    /**
     * Serializa a JSON para almacenamiento
     * @returns {object}
     */
    toJSON() {
        return {
            address: this.address.toJSON(),
            identityKey: this.identityKey.toString('base64'),
            ourBaseKey: this.ourBaseKey.toString('base64'),
            sessionState: this.sessionState,
            fingerprint: this.fingerprint,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Crea una instancia a partir de JSON
     * @param {object} json
     * @returns {SessionRecord}
     */
    static fromJSON(json) {
        const address = ProtocolAddress.fromString(`${json.address.name}:${json.address.deviceId}`);
        const identityKey = Buffer.from(json.identityKey, 'base64');
        const ourBaseKey = Buffer.from(json.ourBaseKey, 'base64');
        const sessionState = json.sessionState || {};
        return new SessionRecord(address, identityKey, ourBaseKey, sessionState);
    }
}

module.exports = SessionRecord;
