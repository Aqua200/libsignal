// src/base_key_type.js
/**
 * @file base_key_type.js
 * @description Define los tipos de claves utilizadas en Signal Protocol.
 * Compatible con WhisperTextProtocol y librerías tipo Baileys.
 */

export const BaseKeyType = Object.freeze({
  OURS: 'ours',              // 🔑 Nuestra clave privada / identidad
  THEIRS: 'theirs',          // 🧩 Clave pública del contacto remoto
  TEMPORARY: 'temporary',    // ⚙️ Clave efímera o de sesión
});

export function validateKeyType(keyType) {
  return Object.values(BaseKeyType).includes(keyType);
}

export function describeKeyType(keyType) {
  switch (keyType) {
    case BaseKeyType.OURS:
      return '🔐 Clave local de identidad (nuestra).';
    case BaseKeyType.THEIRS:
      return '🛰️ Clave pública del contacto remoto.';
    case BaseKeyType.TEMPORARY:
      return '⏳ Clave temporal usada para sesión cifrada.';
    default:
      return '❓ Tipo de clave desconocido.';
  }
}
