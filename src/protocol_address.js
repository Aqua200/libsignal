import { InvalidKeyError } from './errors.js';


export default class ProtocolAddress {
  
  constructor(name, deviceId = 1) {
    if (!name || typeof name !== 'string') {
      throw new InvalidKeyError("El nombre de usuario debe ser una cadena de texto no vacía.");
    }
    if (!Number.isSafeInteger(deviceId) || deviceId < 0) { 
      throw new InvalidKeyError("El deviceId debe ser un entero no negativo.");
    }

    this.name = name;
    this.deviceId = deviceId;

     Object.freeze(this);
  }

  
  equals(other) {
    return (
      other instanceof ProtocolAddress &&
      this.name === other.name &&
      this.deviceId === other.deviceId
    );
  }

  
  toString() {
    return `${this.name}:${this.deviceId}`;
  }

  
  toJSON() {
    return {
      name: this.name,
      deviceId: this.deviceId,
    };
  }


  clone() {
    return new ProtocolAddress(this.name, this.deviceId);
  }

  
  static fromString(str) {
    if (typeof str !== 'string' || !str.includes(':')) {
      throw new InvalidKeyError('El formato de la cadena de dirección es inválido. Se esperaba "name:deviceId".');
    }
    
    const parts = str.split(':');
    if (parts.length !== 2) {
      throw new InvalidKeyError('La dirección debe contener exactamente un separador ":".');
    }

    const [name, deviceIdStr] = parts;
    const deviceId = parseInt(deviceIdStr, 10);

    if (isNaN(deviceId)) {
        throw new InvalidKeyError(`El deviceId "${deviceIdStr}" no es un número válido.`);
    }

   return new ProtocolAddress(name, deviceId);
  }
  
  
  static isValid(str) {
    if (typeof str !== 'string' || !str.includes(':')) {
      return false;
    }
    const parts = str.split(':');
    if (parts.length !== 2) {
      return false;
    }
    const deviceId = parseInt(parts[1], 10);
    return !isNaN(deviceId) && Number.isSafeInteger(deviceId) && deviceId >= 0;
  }
}
