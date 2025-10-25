import { Buffer } from 'buffer';
import { InvalidKeyError } from './errors.js';

export { toBase64Url, fromBase64Url } from './crypto.js';

export { default as Curve25519 } from './curve.js';


export function formatAsSignalPublicKey(publicKeyBuffer) {
  if (!Buffer.isBuffer(publicKeyBuffer) || publicKeyBuffer.length !== 32) {
    throw new InvalidKeyError('El búfer de clave pública debe ser un Buffer de 32 bytes.');
  }
  return { pubKey: publicKeyBuffer };
}


export function formatAsSignalPrivateKey(privateKeyBuffer) {
  if (!Buffer.isBuffer(privateKeyBuffer) || privateKeyBuffer.length !== 32) {
    throw new InvalidKeyError('El búfer de clave privada debe ser un Buffer de 32 bytes.');
  }
  return { privKey: privateKeyBuffer };
}
