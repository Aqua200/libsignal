// src/signal_store.js

const SessionRecord = require('./session_record');
const ProtocolAddress = require('./protocol_address');
const QueueJob = require('./queue_job');
const KeyHelper = require('./keyhelper');
const { curve } = require('./curve');

/**
 * SignalStore: implementación de SignalProtocolStore
 * Compatible con WhisperTextProtocol, SessionBuilder y SessionCipher
 */
class SignalStore {
    constructor() {
        // Diccionarios internos
        this.sessions = new Map();        // address.toString() => SessionRecord
        this.identityKeys = new Map();    // address.name => Buffer
        this.preKeys = new Map();         // preKeyId => { publicKey, privateKey }
        this.signedPreKeys = new Map();   // signedPreKeyId => { publicKey, privateKey, signature }

        this.queue = new QueueJob();      // Procesa jobs de forma secuencial
    }

    // ----------------------------
    // Sessions
    // ----------------------------
    async loadSession(addressStr) {
        return this.sessions.get(addressStr) || null;
    }

    async storeSession(addressStr, sessionRecord) {
        if (!(sessionRecord instanceof SessionRecord)) {
            throw new TypeError("❌ sessionRecord debe ser instancia de SessionRecord");
        }
        this.sessions.set(addressStr, sessionRecord);
    }

    async removeSession(addressStr) {
        this.sessions.delete(addressStr);
    }

    async getAllSessions() {
        return Array.from(this.sessions.values());
    }

    // ----------------------------
    // IdentityKeys
    // ----------------------------
    async loadIdentityKey(addressName) {
        return this.identityKeys.get(addressName) || null;
    }

    async storeIdentityKey(addressName, keyBuffer) {
        if (!Buffer.isBuffer(keyBuffer)) throw new TypeError("❌ keyBuffer debe ser Buffer");
        this.identityKeys.set(addressName, keyBuffer);
    }

    // ----------------------------
    // PreKeys
    // ----------------------------
    async loadPreKey(preKeyId) {
        return this.preKeys.get(preKeyId) || null;
    }

    async storePreKey(preKeyId, preKey) {
        this.preKeys.set(preKeyId, preKey);
    }

    async removePreKey(preKeyId) {
        this.preKeys.delete(preKeyId);
    }

    // ----------------------------
    // Signed PreKeys
    // ----------------------------
    async loadSignedPreKey(signedPreKeyId) {
        return this.signedPreKeys.get(signedPreKeyId) || null;
    }

    async storeSignedPreKey(signedPreKeyId, signedPreKey) {
        this.signedPreKeys.set(signedPreKeyId, signedPreKey);
    }

    async removeSignedPreKey(signedPreKeyId) {
        this.signedPreKeys.delete(signedPreKeyId);
    }

    // ----------------------------
    // Job queue
    // ----------------------------
    addJob(job) {
        this.queue.add(job);
    }

    getQueueSize() {
        return this.queue.size();
    }
}

// ----------------------------
// Instancia global para uso simple
// ----------------------------
const globalSignalStore = new SignalStore();

module.exports = {
    SignalStore,
    globalSignalStore
};
