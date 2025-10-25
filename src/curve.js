import crypto from 'crypto';
import { Buffer } from 'buffer';


export default class Curve25519 {
  
  static generateKeyPair() {
    const ecdh = crypto.createECDH('curve25519');
    ecdh.generateKeys();
    
    return {
      privateKey: ecdh.getPrivateKey(),
      publicKey: ecdh.getPublicKey()
    };
  }

  
  static deriveSharedSecret(privateKey, theirPublicKey) {
    try {
      const ecdh = crypto.createECDH('curve25519');
      ecdh.setPrivateKey(privateKey);
      
      const sharedSecret = ecdh.computeSecret(theirPublicKey);
      
      return sharedSecret;
    } catch (error) {
      console.error('❌ Error derivando la clave compartida Curve25519:', error.message);
      throw new Error(`Fallo en el cálculo del secreto compartido: ${error.message}`);
    }
  }
}
