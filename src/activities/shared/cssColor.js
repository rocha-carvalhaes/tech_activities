// Valida se uma string é uma cor CSS reconhecível. Compartilhado entre atividades.
export function isValidCssColor(value) {
  if (typeof value !== 'string' || value.trim() === '') return false;
  try {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      return CSS.supports('color', value);
    }
  } catch {
    /* ignora e cai no fallback */
  }
  // Fallback (ambiente sem CSS.supports): testa via elemento.
  if (typeof document !== 'undefined') {
    const el = document.createElement('span');
    el.style.color = '';
    el.style.color = value;
    return el.style.color !== '';
  }
  return true;
}

export default isValidCssColor;
