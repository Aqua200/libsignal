const protobuf = require('protobufjs');

/**
 * Este módulo define los mensajes Protobuf usados en Signal Protocol.
 * Ejemplo: PreKeyBundle, WhisperMessage.
 */

// Carga dinámica de esquema Protobuf
// Puedes reemplazar la ruta con tu archivo .proto si lo tienes
const root = new protobuf.Root();

// Definición simple para demostración
const PreKeyBundle = new protobuf.Type("PreKeyBundle")
    .add(new protobuf.Field("registrationId", 1, "uint32"))
    .add(new protobuf.Field("deviceId", 2, "uint32"))
    .add(new protobuf.Field("preKeyPublic", 3, "bytes"))
    .add(new protobuf.Field("signedPreKeyPublic", 4, "bytes"))
    .add(new protobuf.Field("signedPreKeySignature", 5, "bytes"))
    .add(new protobuf.Field("identityKey", 6, "bytes"));

const WhisperMessage = new protobuf.Type("WhisperMessage")
    .add(new protobuf.Field("type", 1, "uint32"))
    .add(new protobuf.Field("body", 2, "bytes"));

root.define("signal").add(PreKeyBundle).add(WhisperMessage);

/**
 * Serializa un objeto a Protobuf
 * @param {Object} obj - Objeto a serializar
 * @param {protobuf.Type} type - Tipo de mensaje (PreKeyBundle o WhisperMessage)
 * @returns {Buffer}
 */
function serialize(obj, type) {
    const errMsg = type.verify(obj);
    if (errMsg) throw new Error("❌ Error validando Protobuf: " + errMsg);
    const message = type.create(obj);
    return type.encode(message).finish();
}

/**
 * Deserializa un buffer Protobuf a objeto
 * @param {Buffer} buffer
 * @param {protobuf.Type} type
 * @returns {Object}
 */
function deserialize(buffer, type) {
    const message = type.decode(buffer);
    return type.toObject(message, { defaults: true });
}

module.exports = {
    root,
    PreKeyBundle,
    WhisperMessage,
    serialize,
    deserialize
};
