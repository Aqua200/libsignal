/**
 * Clase que representa la dirección de protocolo Signal.
 * Incluye el JID del usuario y el ID del dispositivo.
 * Compatible con WhisperTextProtocol y libsignal.
 */

class ProtocolAddress {
    /**
     * @param {string} name - Identificador del usuario (por ejemplo: "user@s.whatsapp.net")
     * @param {number} deviceId - ID del dispositivo (por defecto 1)
     */
    constructor(name, deviceId = 1) {
        if (!name || typeof name !== 'string') {
            throw new TypeError("❌ El nombre de usuario debe ser una cadena no vacía.");
        }
        if (!Number.isInteger(deviceId) || deviceId < 1) {
            throw new TypeError("❌ El deviceId debe ser un entero positivo.");
        }

        this.name = name;
        this.deviceId = deviceId;
    }

    /**
     * Compara si dos direcciones son iguales
     * @param {ProtocolAddress} other
     * @returns {boolean}
     */
    equals(other) {
        if (!(other instanceof ProtocolAddress)) return false;
        return this.name === other.name && this.deviceId === other.deviceId;
    }

    /**
     * Devuelve una representación en cadena
     * @returns {string}
     */
    toString() {
        return `${this.name}:${this.deviceId}`;
    }

    /**
     * Convierte a formato JSON
     * @returns {{ name: string, deviceId: number }}
     */
    toJSON() {
        return {
            name: this.name,
            deviceId: this.deviceId
        };
    }

    /**
     * Crea una instancia a partir de un string "name:deviceId"
     * @param {string} str
     * @returns {ProtocolAddress}
     */
    static fromString(str) {
        const parts = str.split(':');
        if (parts.length !== 2) throw new Error("❌ Formato inválido para ProtocolAddress");
        const [name, deviceId] = parts;
        return new ProtocolAddress(name, parseInt(deviceId, 10));
    }
}

module.exports = ProtocolAddress;
