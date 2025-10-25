export const BaseKeyType = Object.freeze({
 OURS: 'ours',
  
    THEIRS: 'theirs',
  
    TEMPORARY: 'temporary'
});
export function validateKeyType(keyType) {
  return Object.values(BaseKeyType).includes(keyType);
}
export function describeKeyType(keyType) {
  switch (keyType) {
    case BaseKeyType.OURS: return '🔐 Clave local de identidad (nuestra).';
    case BaseKeyType.THEIRS: return '🛰️ Clave pública del contacto remoto.';
    case BaseKeyType.TEMPORARY: return '⏳ Clave temporal usada para sesión cifrada.';
    default: return '❓ Tipo de clave desconocido.';
  }
}
