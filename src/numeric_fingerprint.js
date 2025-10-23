const crypto = require('crypto');
const { toBase64Url, fromBase64Url } = require('./crypto');

/**
 * Convierte un Buffer en un fingerprint numérico de 12 dígitos
 * similar a como Signal muestra la verificación de seguridad.
 * 
 * @param {Buffer} keyBuffer - Clave pública o privada.
 * @returns {string} Fingerprint numérico de 12 dígitos.
 */
function generateNumericFingerprint(keyBuffer) {
    if (!Buffer.isBuffer(keyBuffer)) {
        throw new TypeError("❌ generateNumericFingerprint requiere un Buffer");
    }

    // Hash SHA-256 de la clave
    const hash = crypto.createHash('sha256').update(keyBuffer).digest();

    // Tomamos los últimos 6 bytes y los convertimos a número de 12 dígitos
    const lastSixBytes = hash.slice(-6); // 6 bytes = 48 bits
    const numeric = BigInt('0x' + lastSixBytes.toString('hex')).toString().padStart(12, '0');

    return numeric;
}

/**
 * Compara dos fingerprints numéricos
 * @param {string} fingerprintA
 * @param {string} fingerprintB
 * @returns {boolean} true si son iguales
 */
function compareFingerprints(fingerprintA, fingerprintB) {
    return fingerprintA === fingerprintB;
}

/**
 * Genera fingerprint a partir de Base64 URL-safe
 * @param {string} base64urlKey
 * @returns {string} fingerprint numérico
 */
function fingerprintFromBase64Url(base64urlKey) {
    const buffer = fromBase64Url(base64urlKey);
    return generateNumericFingerprint(buffer);
}

module.exports = {
    generateNumericFingerprint,
    compareFingerprints,
    fingerprintFromBase64Url
};
