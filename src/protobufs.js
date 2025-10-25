import protobuf from 'protobufjs/light'; // Usamos la versión 'light' que es suficiente aquí.
import { Buffer } from 'buffer';
import { InvalidKeyError } from './errors.js';

const root = new protobuf.Root();

export const PreKeyBundle = root.define("signal.PreKeyBundle").add(
  new protobuf.Field("registrationId", 1, "uint32")
).add(
  new protobuf.Field("deviceId", 2, "uint32")
).add(
  new protobuf.Field("preKeyPublic", 3, "bytes")
).add(
  new protobuf.Field("signedPreKeyPublic", 4, "bytes")
).add(
  new protobuf.Field("signedPreKeySignature", 5, "bytes")
).add(
  new protobuf.Field("identityKey", 6, "bytes")
);

export const WhisperMessage = root.define("signal.WhisperMessage").add(
  new protobuf.Field("type", 1, "uint32")
).add(
  new protobuf.Field("body", 2, "bytes")
);


export function serialize(payload, messageType) {
  const validationError = messageType.verify(payload);
  if (validationError) {
    throw new Error(`Validación de Protobuf fallida: ${validationError}`);
  }
  
  const message = messageType.create(payload);
  const buffer = messageType.encode(message).finish();
  return Buffer.from(buffer);
}

W
export function deserialize(buffer, messageType) {
  if (!Buffer.isBuffer(buffer)) {
    throw new InvalidKeyError('La deserialización requiere un Buffer válido.');
  }
  
  const message = messageType.decode(buffer);
  return messageType.toObject(message, {
    bytes: Buffer, // Asegura que los campos 'bytes' se decodifiquen como Buffers
    defaults: true,
  });
}
