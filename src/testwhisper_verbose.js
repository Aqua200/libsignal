// src/testwhisper_verbose.js
import { writeFileSync, appendFileSync } from 'fs';
import { WhisperTextProtocol, SignalMessageType } from './WhisperTextProtocol.js';
import { BaseKeyType, describeKeyType } from './base_key_type.js';
import libsignal from '../mylibsignal/index.js';

const LOG_FILE = './test_log.txt';

// Helper para logging
function log(message, type = 'INFO') {
  const line = `[${type}] ${message}\n`;
  process.stdout.write(line);
  appendFileSync(LOG_FILE, line);
}

async function runTest() {
  log('✨ Iniciando test verboso de libsignal');

  // Detectar si es stub o librería real
  const isStub = libsignal.KeyHelper?.generateIdentityKeyPair?.toString().includes('stub');
  log(`Tipo detectado: ${isStub ? 'STUB (simulado)' : 'REAL LIBRARY'}`);

  log('--- libsignal exports (inspección profunda) ---');
  log(JSON.stringify({
    SignalProtocolAddress: libsignal.SignalProtocolAddress?.toString(),
    SessionBuilder: libsignal.SessionBuilder?.toString(),
    SessionCipher: libsignal.SessionCipher?.toString(),
    KeyHelper: libsignal.KeyHelper
  }, null, 2));

  const store = {
    sessions: {},
    async loadSession(userId) { return this.sessions[userId] || null; },
    async storeSession(userId, session) { this.sessions[userId] = session; }
  };

  const userId = 'user@example.com';
  let protocol;
  try {
    protocol = new WhisperTextProtocol(userId, store);
    log('✔ WhisperTextProtocol instanciado correctamente');
  } catch (err) {
    log(`❌ Error instanciando protocolo: ${err.message}`, 'ERROR');
    return;
  }

  let preKeyBundle;
  try {
    preKeyBundle = {
      identityKey: await libsignal.KeyHelper.generateIdentityKeyPair(),
      preKey: await libsignal.KeyHelper.generatePreKey(),
      signedPreKey: await libsignal.KeyHelper.generateSignedPreKey(),
      registrationId: 1234
    };
    log('✔ preKeyBundle generado:');
    log(JSON.stringify(preKeyBundle, null, 2));
  } catch (err) {
    log(`❌ Error generando preKeyBundle: ${err.message}`, 'ERROR');
    return;
  }

  try {
    await protocol.createSession(preKeyBundle);
    log('✔ Sesión creada correctamente');
  } catch (err) {
    log(`❌ Error creando sesión: ${err.message}`, 'ERROR');
    return;
  }

  const message = 'Mensaje de prueba — verbose';
  let encrypted, decrypted;
  try {
    encrypted = await protocol.encryptMessage(message);
    log('✔ Mensaje cifrado:');
    log(JSON.stringify(encrypted, null, 2));
  } catch (err) {
    log(`❌ Error cifrando mensaje: ${err.message}`, 'ERROR');
    return;
  }

  try {
    decrypted = await protocol.decryptMessage(encrypted.body);
    log('✔ Mensaje descifrado:');
    log(`'${decrypted}'`);
  } catch (err) {
    log(`❌ Error descifrando mensaje: ${err.message}`, 'ERROR');
    return;
  }

  if (decrypted === message) {
    log('✅ Coincide con el original');
  } else {
    log('❌ No coincide con el mensaje original', 'ERROR');
  }

  log('🟢 Test verboso finalizado.');
}

// Limpiar log previo
writeFileSync('./test_log.txt', '');
runTest().catch(err => log(`💥 Excepción no atrapada: ${err.message}`, 'ERROR'));
