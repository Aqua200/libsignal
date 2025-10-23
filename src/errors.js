/**
 * Centraliza los errores comunes del sistema Signal Protocol.
 * Compatible con WhisperTextProtocol y librerías tipo Baileys.
 */

/**
 * Error cuando la librería libsignal no está cargada correctamente.
 */
class LibSignalLoadError extends Error {
    constructor(message = "🚨 La librería 'libsignal' no se ha cargado correctamente.") {
        super(message);
        this.name = "LibSignalLoadError";
    }
}

/**
 * Error cuando la tienda SignalProtocolStore no implementa los métodos necesarios.
 */
class StoreImplementationError extends Error {
    constructor(message = "⚠️ La store no implementa correctamente SignalProtocolStore.") {
        super(message);
        this.name = "StoreImplementationError";
    }
}

/**
 * Error al cifrar un mensaje.
 */
class EncryptionError extends Error {
    constructor(message = "❌ Error cifrando mensaje.") {
        super(message);
        this.name = "EncryptionError";
    }
}

/**
 * Error al descifrar un mensaje.
 */
class DecryptionError extends Error {
    constructor(message = "❌ Error descifrando mensaje.") {
        super(message);
        this.name = "DecryptionError";
    }
}

/**
 * Error cuando el tipo de mensaje Signal es desconocido.
 */
class UnknownMessageTypeError extends Error {
    constructor(message = "❓ Tipo de mensaje Signal desconocido.") {
        super(message);
        this.name = "UnknownMessageTypeError";
    }
}

/**
 * Error cuando la clave de sesión no es válida.
 */
class InvalidKeyError extends Error {
    constructor(message = "❌ Clave inválida o corrupta.") {
        super(message);
        this.name = "InvalidKeyError";
    }
}

module.exports = {
    LibSignalLoadError,
    StoreImplementationError,
    EncryptionError,
    DecryptionError,
    UnknownMessageTypeError,
    InvalidKeyError
};
