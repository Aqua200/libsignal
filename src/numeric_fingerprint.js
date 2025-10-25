import crypto from 'crypto';
import { Buffer } from 'buffer';
import { fromBase64Url } from './crypto.js';
import { InvalidKeyError } from './errors.js';

const FINGERPRINT_BYTE_SOURCE_LENGTH = 6; // Número de bytes del hash que se usarán como fuente.
const FINGERPRINT_DIGIT_LENGTH = 12;      // Longitud final del string numérico.

export function generateNumericFingerprint(keyBuffer) {
  if (!Buffer.isBuffer(keyBuffer) || keyBuffer.length === 0) {
    throw new InvalidKeyError('La generación de fingerprint requiere un Buffer de clave no vacío.');
  }

    const hash = crypto.createHash('sha256').update(keyBuffer).digest();

   const byteSlice = hash.slice(-FINGERPRINT_BYTE_SOURCE_LENGTH);

    const numericString = BigInt('0x' + byteSlice.toString('hex')).toString();
  
    return numericString.padStart(FINGERPRINT_DIGIT_LENGTH, '0');
}


export function compareFingerprints(fingerprintA, fingerprintB) {
  if (typeof fingerprintA !== 'string' || typeof fingerprintB !== 'string') {
    return false;
  }

  try {
    const bufferA = Buffer.from(fingerprintA, 'utf-8');
    const bufferB = Buffer.from(fingerprintB, 'utf-8');

      if (bufferA.length !== bufferB.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(bufferA, bufferB);
  } catch (e) {
    return false;
  }
}


export function fingerprintFromBase64Url(base64urlKey) {
  try {
    const buffer = fromBase64Url(base64urlKey);
    return generateNumericFingerprint(buffer);
  } catch (error) {
      throw new InvalidKeyError(`La clave Base64URL proporcionada es inválida: ${error.message}`, error);
  }
        }
