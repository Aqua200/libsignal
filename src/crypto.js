const crypto = require('crypto');

/**
 * Genera una clave aleatoria segura.
 * @param {number} length - Tamaño en bytes (por defecto 32 bytes).
 * @returns {Buffer}
 */
function generateRandomKey(length = 32) {
    return crypto.randomBytes(length);
}

/**
 * Calcula el hash SHA-256 de una cadena o Buffer.
 * @param {string|Buffer} data
 * @returns {string} Hash en formato hexadecimal.
 */
function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Cifra datos con AES-256-CBC.
 * @param {Buffer|string} plaintext
 * @param {Buffer} key - Debe tener 32 bytes.
 * @param {Buffer} iv - Vector de inicialización (16 bytes).
 * @returns {string} Texto cifrado en base64.
 */
function encryptAES(plaintext, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

/**
 * Descifra datos con AES-256-CBC.
 * @param {string} ciphertext - Texto cifrado en base64.
 * @param {Buffer} key - Debe tener 32 bytes.
 * @param {Buffer} iv - Vector de inicialización (16 bytes).
 * @returns {string} Texto plano.
 */
function decryptAES(ciphertext, key, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

/**
 * Convierte un Buffer a Base64 URL-safe.
 * @param {Buffer} buffer
 * @returns {string}
 */
function toBase64Url(buffer) {
    return buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Convierte Base64 URL-safe a Buffer.
 * @param {string} base64url
 * @returns {Buffer}
 */
function fromBase64Url(base64url) {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return Buffer.from(padded, 'base64');
}

module.exports = {
    generateRandomKey,
    sha256,
    encryptAES,
    decryptAES,
    toBase64Url,
    fromBase64Url
};
