// src/base_key_type.js
/**
 * @file base_key_type.js
 * @description Define los tipos de claves utilizadas en Signal Protocol.
 * Compatible con WhisperTextProtocol y librerías tipo Baileys.
 */

/**
 * Enumeración de tipos de clave base.
 * Permite identificar si la clave pertenece a nosotros, al contacto o si es una clave temporal.
 */
const BaseKeyType = Object.freeze({
  OURS: 'ours',              // 🔑 Nuestra clave privada / identidad
  THEIRS: 'theirs',          // 🧩 Clave pública del contacto remoto
  TEMPORARY: 'temporary',    // ⚙️ Clave efímera o de sesión
});

/**
 * @function validateKeyType
 * @description Verifica si el tipo de clave es válido dentro del protocolo.
 * @param {string} keyType - El tipo de clave a verificar.
 * @returns {boolean} true si es válido, false si no lo es.
 */
function validateKeyType(keyType) {
  return Object.values(BaseKeyType).includes(keyType);
}

/**
 * @function describeKeyType
 * @description Devuelve una descripción textual del tipo de clave.
 * @param {string} keyType - Tipo de clave ('ours', 'theirs', 'temporary').
 * @returns {string} descripción del tipo de clave.
 */
function describeKeyType(keyType) {
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

module.exports = {
  BaseKeyType,
  validateKeyType,
  describeKeyType
};
