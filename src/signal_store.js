import SessionRecord from './session_record.js';
import { Buffer } from 'buffer';


export default class SignalStore {
  
  constructor(initialState = {}) {
    this.#identityKeyPair = initialState.identityKeyPair || null;
    this.#registrationId = initialState.registrationId || null;
    
    this.#sessions = new Map();      // Map<string, SessionRecord>
    this.#preKeys = new Map();       // Map<number, { pubKey: Buffer, privKey: Buffer }>
    this.#signedPreKeys = new Map(); // Map<number, { pubKey: Buffer, privKey: Buffer }>
  }

  #identityKeyPair;
  #registrationId;
  #sessions;
  #preKeys;
  #signedPreKeys;



  getIdentityKeyPair = () => Promise.resolve(this.#identityKeyPair);
  getLocalRegistrationId = () => Promise.resolve(this.#registrationId);
  storeIdentityKeyPair = (identityKeyPair) => {
    this.#identityKeyPair = identityKeyPair;
    return Promise.resolve();
  };
  storeLocalRegistrationId = (registrationId) => {
    this.#registrationId = registrationId;
    return Promise.resolve();
  };

  
  loadSession = (addressStr) => Promise.resolve(this.#sessions.get(addressStr) ?? undefined);
  storeSession = (addressStr, record) => {
    this.#sessions.set(addressStr, new SessionRecord(record)); // Asegura que sea una instancia
    return Promise.resolve();
  };
  containsSession = (addressStr) => Promise.resolve(this.#sessions.has(addressStr));
  removeSession = (addressStr) => {
    this.#sessions.delete(addressStr);
    return Promise.resolve();
  };
  removeAllSessions = (addressName) => {
    for (const key of this.#sessions.keys()) {
      if (key.startsWith(addressName)) {
        this.#sessions.delete(key);
      }
    }
    return Promise.resolve();
  };

  
  loadPreKey = (keyId) => Promise.resolve(this.#preKeys.get(keyId) ?? undefined);
  storePreKey = (keyId, keyPair) => {
    this.#preKeys.set(keyId, keyPair);
    return Promise.resolve();
  };
  removePreKey = (keyId) => {
    this.#preKeys.delete(keyId);
    return Promise.resolve();
  };
  
 
  loadSignedPreKey = (keyId) => Promise.resolve(this.#signedPreKeys.get(keyId) ?? undefined);
  storeSignedPreKey = (keyId, keyPair) => {
    this.#signedPreKeys.set(keyId, keyPair);
    return Promise.resolve();
  };
  removeSignedPreKey = (keyId) => {
    this.#signedPreKeys.delete(keyId);
    return Promise.resolve();
  };
}
