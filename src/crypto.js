import crypto from 'crypto';
import { Buffer } from 'buffer';

const AES_ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM recomienda 12 bytes para el IV.
const AUTH_TAG_LENGTH = 16; // GCM produce una etiqueta de 16 bytes.
const KEY_LENGTH = 32; // Para AES-256.


export function generateRandomKey() {
  return crypto.randomBytes(KEY_LENGTH);
}


export function sha256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}


export function encryptAES(plaintext, key) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(AES_ALGORITHM, key, iv);
  
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf-8'),
    cipher.final()
  ]);
  
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('base64'),
    encrypted: encrypted.toString('base64'),
    tag: tag.toString('base64')
  };
}


export function decryptAES(ciphertext, key, iv, tag) {
  const ivBuffer = Buffer.from(iv, 'base64');
  const encryptedBuffer = Buffer.from(ciphertext, 'base64');
  const tagBuffer = Buffer.from(tag, 'base64');
  
  const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(tagBuffer);

  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final()
  ]);
  
  return decrypted.toString('utf-8');
}



export function toBase64Url(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}


export function fromBase64Url(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
 const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, 'base64');
}
