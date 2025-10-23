// testWhisper.js
import { WhisperTextProtocol, SignalMessageType } from './src/WhisperTextProtocol.js';
import { BaseKeyType } from './src/base_key_type.js';
import libsignal from './mylibsignal/index.js'; // tu wrapper

// Mock store simple en memoria
class MemoryStore {
    constructor() {
        this.sessions = {};
    }
    async loadSession(userId) {
        return this.sessions[userId] || null;
    }
    async storeSession(userId, session) {
        this.sessions[userId] = session;
    }
}

async function test() {
    const store = new MemoryStore();
    const userId = 'user@example.com';

    // Crear protocolo para usuario
    const protocol = new WhisperTextProtocol(userId, store);

    // Generar preKeyBundle (stub avanzado)
    const preKeyBundle = {
        identityKey: await libsignal.KeyHelper.generateIdentityKeyPair(),
        preKey: await libsignal.KeyHelper.generatePreKey(),
        signedPreKey: await libsignal.KeyHelper.generateSignedPreKey(),
        registrationId: 1234
    };

    console.log('🔹 PreKeyBundle generado:', preKeyBundle);

    // Crear sesión
    await protocol.createSession(preKeyBundle);

    // Cifrar mensaje
    const plaintext = 'Hola, esto es una prueba de libsignal!';
    const encrypted = await protocol.encryptMessage(plaintext);
    console.log('🔐 Mensaje cifrado:', encrypted);

    // Descifrar mensaje
    const decrypted = await protocol.decryptMessage(encrypted.body);
    console.log('🔓 Mensaje descifrado:', decrypted);

    if (decrypted === plaintext) {
        console.log('✅ Test exitoso: el mensaje fue cifrado y descifrado correctamente.');
    } else {
        console.error('❌ Test fallido: el mensaje descifrado no coincide.');
    }
}

test().catch(console.error);
