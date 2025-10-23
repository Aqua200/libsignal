// mylibsignal/index.js
// Stub "completo" para pruebas: simula KeyHelper, SessionBuilder, SessionCipher y bundles.
// NOTA: Solo para testing/local. No es una implementación real/segura de Signal.

const crypto = require('crypto');

let libsignal;

try {
  libsignal = require('libsignal-protocol-javascript');
  console.log('✅ libsignal-protocol-javascript cargado correctamente.');
} catch (err) {
  console.warn('⚠️ libsignal-protocol-javascript no disponible. Cargando stub completo para pruebas.');
  // --- Helpers internos ---
  const randomBytes = (n) => crypto.randomBytes(n);
  const bufToHex = (b) => Buffer.from(b).toString('hex');
  const hexToBuf = (h) => Buffer.from(h, 'hex');

  // Deriva una clave de longitud `len` desde secret material usando HKDF-like (HMAC-SHA256)
  function deriveKey(secretMaterial, info = 'mylibsignal', len = 32) {
    const prk = crypto.createHmac('sha256', Buffer.alloc(32)).update(secretMaterial).digest();
    let t = Buffer.alloc(0);
    let okm = Buffer.alloc(0);
    let i = 0;
    while (okm.length < len) {
      i++;
      const hmac = crypto.createHmac('sha256', prk);
      hmac.update(Buffer.concat([t, Buffer.from(info), Buffer.from([i])]));
      t = hmac.digest();
      okm = Buffer.concat([okm, t]);
    }
    return okm.slice(0, len);
  }

  // AES-256-GCM helpers
  function aesGcmEncrypt(key, plaintext) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const ct = Buffer.concat([cipher.update(Buffer.from(plaintext)), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, ct]); // iv (12) | tag (16) | ciphertext
  }
  function aesGcmDecrypt(key, payload) {
    const iv = payload.slice(0, 12);
    const tag = payload.slice(12, 28);
    const ct = payload.slice(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(ct), decipher.final()]);
    return plain.toString();
  }

  // Almacenamientos en memoria (exponibles para debugging)
  const identityStore = new Map(); // regId -> identityKeyPair
  const preKeyStore = new Map(); // regId -> { preKey, signedPreKey }
  const sessionStore = new Map(); // sessionKey -> session object

  // Construcción del stub "libsignal"
  libsignal = {
    SignalProtocolAddress: class {
      constructor(name, deviceId = 0) {
        this.name = name;
        this.deviceId = deviceId;
      }
      toString() {
        return `${this.name}:${this.deviceId}`;
      }
    },

    // KeyHelper: genera identityKeyPair, preKey, signedPreKey, y bundles
    KeyHelper: {
      // Genera par de claves "identity" (simulado con randomBytes)
      async generateIdentityKeyPair() {
        const priv = randomBytes(32);
        const pub = deriveKey(priv, 'identity-pub', 33); // pub simulada (no curva real)
        return { pubKey: pub, privKey: priv };
      },

      // Genera una PreKey simple
      async generatePreKey(keyId = undefined) {
        const id = keyId || Math.floor(Math.random() * 1e6);
        const priv = randomBytes(32);
        const pub = deriveKey(priv, `prekey-${id}`, 33);
        return { keyId: id, publicKey: pub, privateKey: priv };
      },

      // Genera SignedPreKey: incluye "signature" HMAC sobre la publicKey usando identity priv
      async generateSignedPreKey(identityPriv, keyId = undefined) {
        const id = keyId || Math.floor(Math.random() * 1e6);
        const priv = randomBytes(32);
        const pub = deriveKey(priv, `signedpre-${id}`, 33);
        // Signature simulada: HMAC-SHA256(identityPriv, pub)
        const signature = crypto.createHmac('sha256', identityPriv).update(pub).digest();
        return { keyId: id, publicKey: pub, privateKey: priv, signature };
      },

      // Genera un PreKeyBundle
      async generatePreKeyBundle({ registrationId = undefined } = {}) {
        const regId = registrationId || Math.floor(Math.random() * 1e9);
        const identity = await libsignal.KeyHelper.generateIdentityKeyPair();
        const preKey = await libsignal.KeyHelper.generatePreKey();
        const signedPre = await libsignal.KeyHelper.generateSignedPreKey(identity.privKey);
        // Guardar en stores
        identityStore.set(regId, identity);
        preKeyStore.set(regId, { preKey, signedPre });
        return {
          registrationId: regId,
          identityKey: identity.pubKey,
          signedPreKey: { keyId: signedPre.keyId, publicKey: signedPre.publicKey, signature: signedPre.signature },
          preKey: { keyId: preKey.keyId, publicKey: preKey.publicKey }
        };
      }
    },

    // SessionBuilder: crea/establece una "sesión" a partir de un bundle remoto
    SessionBuilder: class {
      constructor(store /*ignored: but kept for API*/, address) {
        this.store = store;
        this.address = address; // SignalProtocolAddress
      }
      // build recibe un bundle remoto (preKey bundle) y guarda una session
      async build(remoteBundle) {
        const localReg = Math.floor(Math.random() * 1e9); // id local temporal
        // Simula derivación de secreto compartido: HMAC(identityPriv || signedPrePriv, remotePub)
        // Para pruebas, creamos un secretMaterial reproducible usando concatenación
        const localIdentity = await libsignal.KeyHelper.generateIdentityKeyPair();
        const remoteIdentityPub = remoteBundle.identityKey || Buffer.alloc(0);
        const secretMaterial = Buffer.concat([localIdentity.privKey, remoteIdentityPub]);
        const sessionKey = deriveKey(secretMaterial, `session:${this.address.toString()}`, 32);
        // Guardar session en memoria
        const key = `${this.address.toString()}|${localReg}`;
        sessionStore.set(key, {
          localRegistrationId: localReg,
          remote: this.address.toString(),
          sessionKey: sessionKey, // Buffer
          createdAt: Date.now(),
          messages: []
        });
        return true;
      }
    },

    // SessionCipher: cifra/descifra con la clave de sesión
    SessionCipher: class {
      constructor(store /*ignored*/, address) {
        this.store = store;
        this.address = address;
      }

      _findSessionKey() {
        // Busca la primera session que coincida con la address
        for (const [k, v] of sessionStore.entries()) {
          if (v.remote && v.remote.startsWith(this.address.name)) {
            return { sessionKey: v.sessionKey, sessionKeyId: k, sessionObj: v };
          }
        }
        return null;
      }

      // plaintext puede ser string o Buffer
      async encrypt(plaintext) {
        const sess = this._findSessionKey();
        if (!sess) {
          throw new Error('[Stub] No session found for address. Llama a SessionBuilder.build() primero.');
        }
        const key = sess.sessionKey; // Buffer(32)
        const payload = typeof plaintext === 'string' ? plaintext : plaintext.toString();
        const ct = aesGcmEncrypt(key, payload);
        // Guardar en log de sesión
        sess.sessionObj.messages.push({ type: 'sent', ts: Date.now(), data: ct });
        return ct; // Buffer
      }

      // ciphertext es Buffer
      async decrypt(ciphertext) {
        const sess = this._findSessionKey();
        if (!sess) {
          throw new Error('[Stub] No session found for address. Llama a SessionBuilder.build() primero.');
        }
        const key = sess.sessionKey;
        try {
          const pt = aesGcmDecrypt(key, ciphertext);
          sess.sessionObj.messages.push({ type: 'recv', ts: Date.now(), data: ciphertext });
          return pt; // string
        } catch (e) {
          // fallo de autenticación o formato
          throw new Error('[Stub] decrypt error: ' + e.message);
        }
      }
    },

    // Exponer stores para debugging/testing
    _debug: {
      identityStore,
      preKeyStore,
      sessionStore
    }
  };
}

// --- Exportación universal (CommonJS + ESM interop) ---
if (typeof module !== 'undefined' && module.exports) {
  module.exports = libsignal;
}
if (typeof exports !== 'undefined') {
  exports.default = libsignal;
      }
