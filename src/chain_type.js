// src/chain_type.js

/**
 * Enumeración de tipos de cadena usados por el protocolo Signal.
 * Cada tipo indica el rol dentro de una sesión (nuestro lado o el remoto).
 */

const ChainType = {
    /**
     * Cadena que usamos para enviar mensajes cifrados.
     * (Nuestro propio lado de la sesión)
     */
    SENDING: 1,

    /**
     * Cadena que usamos para recibir mensajes cifrados.
     * (El lado del contacto remoto)
     */
    RECEIVING: 2,

    /**
     * Cadena que aún no ha sido establecida o está en proceso.
     */
    UNKNOWN: 0,
};

/**
 * Devuelve una descripción amigable del tipo de cadena.
 * @param {number} type - Código de tipo de cadena.
 * @returns {string}
 */
function describeChainType(type) {
    switch (type) {
        case ChainType.SENDING:
            return '🔒 Cadena de envío (nuestra)';
        case ChainType.RECEIVING:
            return '📥 Cadena de recepción (remota)';
        default:
            return '❔ Tipo de cadena desconocido';
    }
}

module.exports = {
    ChainType,
    describeChainType
};
