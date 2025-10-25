export const ChainType = Object.freeze({
    UNKNOWN: 0,
  
    SENDING: 1,
  
  RECEIVING: 2,
});


export function validateChainType(type) {
  return Object.values(ChainType).includes(type);
}


export function describeChainType(type) {
  switch (type) {
    case ChainType.SENDING:
      return '🔒 Cadena de envío (nuestra)';
    case ChainType.RECEIVING:
      return '📥 Cadena de recepción (remota)';
    default:
      return '❔ Tipo de cadena desconocido';
  }
}
