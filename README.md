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

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/Aqua200/libsignal.git
    cd libsignal
    ```
    *Este proyecto requiere **Node.js >= 18** y funciona en Termux.*

---

## 🏗️ Estructura del proyecto

src/

base_key_type.js

chain_type

- crypto.js

curve.js

- errors.js

keyhelper.js

numeric_fingerpri

protobufs.js

protocol_addre

queue_job.js

- session_builde

- session_cipher.js

- session_re

- signal_store.js

WhisperTextProtocol.js

package.json

---

## 🚀 Uso básico

**Importante:** Este proyecto utiliza ES Modules. Asegúrate de usar la sintaxis `import`.

#### Inicializar SignalStore
```javascript
import { globalSignalStore } from './src/signal_store.js';
```

---

import ProtocolAddress from './src/protocol_address.js';
import SessionBuilder from './src/session_builder.js';

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
import ProtocolAddress from './src/protocol_address.js';
import SessionBuilder from './src/session_builder.js';
import { globalSignalStore } from './src/signal_store.js';

const users = [
    new ProtocolAddress('user1@s.whatsapp.net', 1),
    new ProtocolAddress('user2@s.whatsapp.net', 1)
];

for (const user of users) {
    const builder = new SessionBuilder(globalSignalStore);
    // preKeyBundle debe venir de cada usuario específico
    // builder.createSession(user, preKeyBundleDeCadaUsuario);
}





