# Signal Protocol Wrapper para Node.js / Termux

![Portada](https://files.catbox.moe/3nbwb0.jpeg) 

Este proyecto es un **wrapper local de Signal Protocol**, pensado para integrarse con **Baileys**, **WhatsApp Bots** y sistemas de mensajería cifrada.  
Permite gestionar **sesiones, PreKeys, cifrado/descifrado de mensajes**, y almacenar toda la información de Signal en Node.js.

---

## 🔹 Características

- **WhisperTextProtocol**: Cifrado y descifrado de mensajes tipo Signal.
- **SessionBuilder**: Inicialización de sesiones con PreKeyBundles.
- **SessionCipher**: Manejo de cifrado y descifrado por sesión.
- **SessionRecord**: Representación completa de una sesión Signal.
- **SignalStore**: Almacenamiento de sesiones, IdentityKeys y PreKeys.
- **QueueJob**: Cola de trabajos asíncrona para evitar colisiones de cifrado.
- Compatible con **Termux** y **Node.js 18+**.
- Uso de **ProtocolAddress** y **numeric fingerprints** para seguridad adicional.
- Modular y escalable para integración con bots de WhatsApp.
- Soporte de **múltiples usuarios y sub-bots**.

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

---

Este proyecto requiere Node.js >= 18 y funciona en Termux.

---
Estructura del proyecto

src/
├─ base_key_type.js
├─ chain_type.js
├─ crypto.js
├─ curve.js
├─ errors.js
├─ keyhelper.js
├─ numeric_fingerprint.js
├─ protobufs.js
├─ protocol_address.js
├─ queue_job.js
├─ session_builder.js
├─ session_cipher.js
├─ session_record.js
├─ signal_store.js
└─ WhisperTextProtocol.js
mylibsignal/
├─ index.js
├─ package.json

---

Uso básico

Inicializar SignalStore

const { globalSignalStore } = require('./src/signal_store');

---

Crear sesión con un contacto

const ProtocolAddress = require('./src/protocol_address');
const SessionBuilder = require('./src/session_builder');

const contact = new ProtocolAddress('user@s.whatsapp.net', 1);
const builder = new SessionBuilder(globalSignalStore);

const preKeyBundle = {
    registrationId: 1234,
    deviceId: 1,
    preKeyPublic: Buffer.from('abc'),
    signedPreKeyPublic: Buffer.from('def'),
    signedPreKeySignature: Buffer.from('ghi'),
    identityKey: Buffer.from('xyz')
};

builder.createSession(contact, preKeyBundle);

---
Cifrar un mensaje


const SessionCipher = require('./src/session_cipher');

const cipher = new SessionCipher(globalSignalStore, contact);
const encrypted = await cipher.encryptMessage("Hola mundo");

console.log("📦 Mensaje cifrado:", encrypted);

---

Descifrar un mensaje

const decrypted = await cipher.decryptMessage(encrypted.body, encrypted.type);
console.log("📄 Mensaje descifrado:", decrypted);


---

Múltiples usuarios / sub-bots

const users = [
    new ProtocolAddress('user1@s.whatsapp.net', 1),
    new ProtocolAddress('user2@s.whatsapp.net', 1)
];

for (const user of users) {
    const builder = new SessionBuilder(globalSignalStore);
    // preKeyBundle debe venir de cada usuario
    builder.createSession(user, preKeyBundle);
}

---
