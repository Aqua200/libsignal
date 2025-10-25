import { generateNumericFingerprint } from './numeric_fingerprint.js';
import ProtocolAddress from './protocol_address.js';
import { InvalidKeyError } from './errors.js';
import { Buffer } from 'buffer';


export default class SessionRecord {
  
  constructor({ address, identityKey, ourBaseKey, sessionState = {}, createdAt, updatedAt }) {
    if (!(address instanceof ProtocolAddress)) {
      throw new TypeError("El parámetro 'address' debe ser una instancia de ProtocolAddress.");
    }
    if (!Buffer.isBuffer(identityKey) || !Buffer.isBuffer(ourBaseKey)) {
      throw new InvalidKeyError("Las claves 'identityKey' y 'ourBaseKey' deben ser Buffers.");
    }

    this.address = address;
    this.identityKey = identityKey;
    this.ourBaseKey = ourBaseKey;
    this.sessionState = sessionState;

    this.fingerprint = generateNumericFingerprint(identityKey);
    this.createdAt = createdAt || Date.now();
    this.updatedAt = updatedAt || this.createdAt;

      Object.freeze(this);
  }

  
  withUpdatedSessionState(newState) {
    return new SessionRecord({
      ...this, 
      sessionState: newState,
      updatedAt: Date.now(),
    });
  }

  
  toJSON() {
    return {
      address: this.address.toJSON(),
      identityKey: this.identityKey.toString('base64'),
      ourBaseKey: this.ourBaseKey.toString('base64'),
      sessionState: this.sessionState,
      fingerprint: this.fingerprint,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  
  static fromJSON(json) {
     const requiredFields = ['address', 'identityKey', 'ourBaseKey', 'sessionState', 'createdAt', 'updatedAt'];
    for (const field of requiredFields) {
      if (json[field] === undefined) {
        throw new Error(`El JSON del registro de sesión está corrupto. Falta el campo: '${field}'.`);
      }
    }

    try {
      const address = ProtocolAddress.fromString(`${json.address.name}:${json.address.deviceId}`);
      const identityKey = Buffer.from(json.identityKey, 'base64');
      const ourBaseKey = Buffer.from(json.ourBaseKey, 'base64');

      return new SessionRecord({
        address,
        identityKey,
        ourBaseKey,
        sessionState: json.sessionState,
        createdAt: json.createdAt, 
        updatedAt: json.updatedAt,   
      });
    } catch (error) {
         throw new Error(`Fallo al reconstruir SessionRecord desde JSON: ${error.message}`, { cause: error });
    }
  }
}
