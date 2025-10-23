// src/curve.js

const crypto = require('crypto');

/**
 * Implementación simplificada de operaciones con Curve25519
 * para generar claves y realizar intercambio ECDH.
 *
 * ⚠️ Este módulo está diseñado para pruebas y compatibilidad
 * local con Baileys/libsignal, no para uso en producción directa.
 */
class Curve25519 {
    /**
     * Genera un par de claves (privada + pública) usando X25519.
     * @returns {{ privateKey: Buffer, publicKey: Buffer }}
     */
    static generateKeyPair() {
        const privateKey = crypto.generateKeyPairSync('x25519');
        return {
            privateKey: privateKey.privateKey.export({ type: 'pkcs8', format: 'der' }),
            publicKey: privateKey.publicKey.export({ type: 'spki', format: 'der' })
        };
    }

    /**
     * Deriva una clave compartida entre dos pares de claves.
     * @param {Buffer} privateKeyDer - Clave privada (formato DER)
     * @param {Buffer} publicKeyDer - Clave pública del otro usuario (formato DER)
     * @returns {Buffer} Clave compartida de 32 bytes.
     */
    static deriveSharedSecret(privateKeyDer, publicKeyDer) {
        try {
            const privateKey = crypto.createPrivateKey({ key: privateKeyDer, type: 'pkcs8', format: 'der' });
            const publicKey = crypto.createPublicKey({ key: publicKeyDer, type: 'spki', format: 'der' });

            const secret = crypto.diffieHellman({
                privateKey,
                publicKey
            });

            return secret;
        } catch (error) {
            console.error('❌ Error derivando clave compartida Curve25519:', error.message);
            throw error;
        }
    }

    /**
     * Convierte una clave pública o privada a formato Base64 URL-safe.
     * @param {Buffer} keyBuffer
     * @returns {string}
     */
    static toBase64Url(keyBuffer) {
        return keyBuffer
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    /**
     * Convierte una clave Base64 URL-safe a Buffer.
     * @param {string} base64url
     * @returns {Buffer}
     */
    static fromBase64Url(base64url) {
        const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        return Buffer.from(padded, 'base64');
    }
}

module.exports = Curve25519;
