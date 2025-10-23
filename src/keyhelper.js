// src/keyhelper.js

const crypto = require('crypto');
const Curve25519 = require('./curve');
const { toBase64Url, fromBase64Url } = require('./crypto');

/**
 * Funciones auxiliares para manejo de claves en Signal Protocol
 */

class KeyHelper {

    /**
     * Genera un par de claves Curve25519 (privada + pública)
     * @returns {{ privateKey: Buffer, publicKey: Buffer }}
     */
    static generateKeyPair() {
        return Curve25519.generateKeyPair();
    }

    /**
     * Deriva una clave compartida usando ECDH Curve25519
     * @param {Buffer} ourPrivateKey
     * @param {Buffer} theirPublicKey
     * @returns {Buffer} Clave compartida de 32 bytes
     */
    static deriveSharedSecret(ourPrivateKey, theirPublicKey) {
        return Curve25519.deriveSharedSecret(ourPrivateKey, theirPublicKey);
    }

    /**
     * Convierte un Buffer de clave a Base64 URL-safe
     * @param {Buffer} keyBuffer
     * @returns {string}
     */
    static keyToBase64Url(keyBuffer) {
        return toBase64Url(keyBuffer);
    }

    /**
     * Convierte Base64 URL-safe a Buffer de clave
     * @param {string} base64url
     * @returns {Buffer}
     */
    static keyFromBase64Url(base64url) {
        return fromBase64Url(base64url);
    }

    /**
     * Crea un objeto de clave pública en formato compatible con libsignal
     * @param {Buffer} publicKeyBuffer
     * @returns {{pubKey: Buffer}}
     */
    static createSignalPublicKey(publicKeyBuffer) {
        return { pubKey: publicKeyBuffer };
    }

    /**
     * Crea un objeto de clave privada en formato compatible con libsignal
     * @param {Buffer} privateKeyBuffer
     * @returns {{privKey: Buffer}}
     */
    static createSignalPrivateKey(privateKeyBuffer) {
        return { privKey: privateKeyBuffer };
    }
}

module.exports = KeyHelper;
