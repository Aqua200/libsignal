class SignalProtocolError extends Error {
  
  constructor(message, cause) {
        super(message, { cause });
    
    this.name = this.constructor.name;
  }
}


export class LibSignalLoadError extends SignalProtocolError {
  constructor(message = "La librería 'libsignal' no se ha cargado correctamente.", cause) {
    super(message, cause);
  }
}


export class StoreImplementationError extends SignalProtocolError {
  constructor(message = "La store no implementa correctamente la interfaz SignalProtocolStore.", cause) {
    super(message, cause);
  }
}


export class EncryptionError extends SignalProtocolError {
  constructor(message = "Error durante el cifrado del mensaje.", cause) {
    super(message, cause);
  }
}


export class DecryptionError extends SignalProtocolError {
  constructor(message = "Error durante el descifrado del mensaje.", cause) {
    super(message, cause);
  }
}


export class UnknownMessageTypeError extends SignalProtocolError {
  constructor(message = "El tipo de mensaje Signal es desconocido o no soportado.", cause) {
    super(message, cause);
  }
}


export class InvalidKeyError extends SignalProtocolError {
  constructor(message = "La clave proporcionada es inválida, está corrupta o tiene un formato incorrecto.", cause) {
    super(message, cause);
  }
}
