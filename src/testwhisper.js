// src/testwhisper.js
import { WhisperTextProtocol, BaseKeyType } from './WhisperTextProtocol.js';
import libsignal from '../mylibsignal/index.js';

class MemoryStore {
  constructor() { this.sessions = {}; }
  async loadSession(userId) { return this.sessions[userId] || null; }
  async storeSession(userId, session) { this.sessions[userId] = session; }
}

async function test() {
  const store = new MemoryStore();
  const userId = 'user@example.com';
  const protocol = new WhisperTextProtocol(userId, store);

  const preKeyBundle = {
    identityKey: await libsignal.KeyHelper.generateIdentityKeyPair(),
    preKey: await libsignal.KeyHelper.generatePreKey(),
    signedPreKey: await libsignal.KeyHelper.generateSignedPreKey(),
    registrationId: 1234
  };

  console.log('🔹 PreKeyBundle generado:', preKeyBundle);

  await protocol.createSession(preKeyBundle);

  const plaintext = 'Hola, prueba libsignal en Termux!';
  const encrypted = await protocol.encryptMessage(plaintext);
  console.log('🔐 Mensaje cifrado:', encrypted);

  const decrypted = await protocol.decryptMessage(encrypted.body);
  console.log('🔓 Mensaje descifrado:', decrypted);

  if (decrypted === plaintext) {
    console.log('✅ Test exitoso: mensaje cifrado y descifrado correctamente.');
  } else {
    console.error('❌ Test fallido: mensaje descifrado no coincide.');
  }
}

test().catch(console.error);
