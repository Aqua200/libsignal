// src/testwhisper_verbose.js
import { WhisperTextProtocol, BaseKeyType } from './WhisperTextProtocol.js';
import libsignal from '../mylibsignal/index.js';
import { inspect } from 'util';

function pretty(obj, opts = {}) {
  return inspect(obj, { depth: null, colors: false, maxArrayLength: null, ...opts });
}

class MemoryStore {
  constructor() { this.sessions = {}; }
  async loadSession(userId) { return this.sessions[userId] || null; }
  async storeSession(userId, session) { this.sessions[userId] = session; }
}

async function logLibsignalExports() {
  try {
    console.log('--- libsignal exports (inspección profunda) ---');
    console.log(pretty(libsignal));
  } catch (e) {
    console.error('Error inspeccionando libsignal exports:', e && e.stack ? e.stack : e);
  }
}

async function runVerboseTest() {
  console.log('✨ Iniciando test verboso de libsignal');

  // Indicar si es stub o real (intentamos deducir)
  try {
    const isStub = (
      !libsignal ||
      (libsignal && libsignal.KeyHelper && typeof libsignal.KeyHelper.generateIdentityKeyPair === 'function' &&
       (libsignal.KeyHelper.generateIdentityKeyPair.toString().includes('[native code]') === false))
    );
    console.log('Tipo detectado:', isStub ? 'STUB (simulado)' : 'LIBRERÍA REAL (posible)');
  } catch (e) {
    console.warn('No fue posible detectar tipo (continuamos)...', e && e.stack ? e.stack : e);
  }

  await logLibsignalExports();

  const store = new MemoryStore();
  const userId = 'user@example.com';

  // 1) Instanciar protocolo
  let protocol;
  try {
    protocol = new WhisperTextProtocol(userId, store);
    console.log('✔ WhisperTextProtocol instanciado correctamente.');
  } catch (error) {
    console.error('❌ ERROR al instanciar WhisperTextProtocol:');
    console.error(error && error.stack ? error.stack : pretty(error));
    return;
  }

  // 2) Generar preKeyBundle
  let preKeyBundle;
  try {
    preKeyBundle = {
      identityKey: await libsignal.KeyHelper.generateIdentityKeyPair(),
      preKey: await libsignal.KeyHelper.generatePreKey(),
      signedPreKey: await libsignal.KeyHelper.generateSignedPreKey(),
      registrationId: 1234
    };
    console.log('✔ preKeyBundle generado:');
    console.log(pretty(preKeyBundle));
  } catch (error) {
    console.error('❌ ERROR al generar preKeyBundle:');
    console.error(error && error.stack ? error.stack : pretty(error));
    return;
  }

  // 3) Crear sesión
  try {
    await protocol.createSession(preKeyBundle);
    console.log('✔ Sesión creada correctamente.');
  } catch (error) {
    console.error('❌ ERROR al crear sesión:');
    console.error(error && error.stack ? error.stack : pretty(error));
    console.log('Estado store:', pretty(store.sessions));
    return;
  }

  // 4) Cifrar mensaje
  const plaintext = 'Mensaje de prueba — verbose';
  let encrypted;
  try {
    encrypted = await protocol.encryptMessage(plaintext);
    console.log('✔ Mensaje cifrado:');
    console.log(pretty(encrypted));
  } catch (error) {
    console.error('❌ ERROR al cifrar mensaje:');
    console.error(error && error.stack ? error.stack : pretty(error));
    return;
  }

  // 5) Descifrar mensaje
  try {
    const decrypted = await protocol.decryptMessage(encrypted.body);
    console.log('✔ Mensaje descifrado:');
    console.log(pretty(decrypted));
    console.log(decrypted === plaintext ? '✅ Coincide con el original' : '❌ NO coincide con el original');
  } catch (error) {
    console.error('❌ ERROR al descifrar mensaje:');
    console.error(error && error.stack ? error.stack : pretty(error));
    return;
  }

  // 6) Inspeccionar stores internos (si el stub los expone)
  try {
    if (libsignal._debug) {
      console.log('--- libsignal._debug ---');
      console.log(pretty(libsignal._debug));
    } else {
      console.log('libsignal._debug no disponible (stub minimal o librería real sin exposiciones internas).');
    }
  } catch (e) {
    console.error('Error inspeccionando _debug:', e && e.stack ? e.stack : pretty(e));
  }

  console.log('🟢 Test verboso finalizado.');
}

(async () => {
  try {
    await runVerboseTest();
  } catch (e) {
    console.error('Falla no controlada en runVerboseTest:');
    console.error(e && e.stack ? e.stack : pretty(e));
  }
})();
