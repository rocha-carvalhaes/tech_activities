// Parser do "código" do slime companion (size/color/hat). Espelha o parseAttrs do
// Personagem Saltador (mesmo retorno { values, errors, warnings, ok }, mesma
// remoção de comentários e clamp), com um tipo a mais: `enum` (chapéu).
import { SLIME_ATTR_DEFS } from './slimeConstants';
import { isValidCssColor } from '../shared/cssColor';

const DEFS_BY_KEY = Object.fromEntries(SLIME_ATTR_DEFS.map((d) => [d.key, d]));
const KNOWN_KEYS = SLIME_ATTR_DEFS.map((d) => d.key);

function clamp(n, min, max) {
  if (typeof min === 'number' && n < min) return min;
  if (typeof max === 'number' && n > max) return max;
  return n;
}

// Rótulo amigável das opções de um enum (mostra "" como "" (nenhum)).
function optionsLabel(options) {
  return options.map((o) => (o === '' ? '"" (nenhum)' : `"${o}"`)).join(', ');
}

export function parseSlimeAttrs(code) {
  const errors = [];
  const warnings = [];
  const values = {};
  const seen = new Set();

  const lines = String(code ?? '').split('\n');

  lines.forEach((raw, i) => {
    const lineNo = i + 1;
    const line = raw.replace(/#.*$/, '').trim(); // remove comentários e espaços
    if (line === '') return;

    const eq = line.indexOf('=');
    if (eq === -1) {
      errors.push({ line: lineNo, key: null, message: `Linha ${lineNo}: use o formato "atributo = valor".` });
      return;
    }

    const key = line.slice(0, eq).trim();
    const rawValue = line.slice(eq + 1).trim();

    if (!KNOWN_KEYS.includes(key)) {
      errors.push({ line: lineNo, key, message: `Linha ${lineNo}: não conheço o atributo "${key}". Use: ${KNOWN_KEYS.join(', ')}.` });
      return;
    }
    if (seen.has(key)) {
      warnings.push({ key, message: `"${key}" aparece mais de uma vez; usei o último valor.` });
    }
    seen.add(key);

    const def = DEFS_BY_KEY[key];

    if (def.type === 'color') {
      const m = rawValue.match(/^"([^"]*)"$|^'([^']*)'$/);
      if (!m) {
        errors.push({ line: lineNo, key, message: `Linha ${lineNo}: color é um texto e precisa de aspas, ex.: color = "teal".` });
        return;
      }
      const colorStr = m[1] ?? m[2] ?? '';
      if (!isValidCssColor(colorStr)) {
        errors.push({ line: lineNo, key, message: `Linha ${lineNo}: "${colorStr}" não é uma cor reconhecida. Tente nomes como "teal", "tomato" ou "#7c3aed".` });
        return;
      }
      values[key] = colorStr;
      return;
    }

    if (def.type === 'enum') {
      const m = rawValue.match(/^"([^"]*)"$|^'([^']*)'$/);
      if (!m) {
        errors.push({ line: lineNo, key, message: `Linha ${lineNo}: ${key} é um texto e precisa de aspas, ex.: ${key} = "cap" (ou "" para nenhum).` });
        return;
      }
      const v = m[1] ?? m[2] ?? '';
      if (!def.options.includes(v)) {
        errors.push({ line: lineNo, key, message: `Linha ${lineNo}: "${v}" não é um valor de ${key}. Opções: ${optionsLabel(def.options)}.` });
        return;
      }
      values[key] = v;
      return;
    }

    // Numéricos: int.
    if (rawValue === '' || !/^[-+]?\d*\.?\d+$/.test(rawValue)) {
      errors.push({ line: lineNo, key, message: `Linha ${lineNo}: ${key} deve ser um número.` });
      return;
    }
    const num = Number(rawValue);
    if (def.type === 'int' && !Number.isInteger(num)) {
      errors.push({ line: lineNo, key, message: `Linha ${lineNo}: ${key} deve ser um número inteiro (sem casas decimais). Você escreveu ${rawValue}.` });
      return;
    }
    const clamped = clamp(num, def.min, def.max);
    if (clamped !== num) {
      warnings.push({ key, message: `${key} foi ajustado para ${clamped} (válido entre ${def.min} e ${def.max}).` });
    }
    values[key] = clamped;
  });

  // Atributos faltando → erro.
  for (const def of SLIME_ATTR_DEFS) {
    if (!(def.key in values) && !errors.some((e) => e.key === def.key)) {
      errors.push({ line: null, key: def.key, message: `Faltou definir "${def.key}".` });
    }
  }

  // values sempre completo (default quando inválido/faltando) p/ o preview nunca quebrar.
  const safeValues = {};
  for (const def of SLIME_ATTR_DEFS) {
    safeValues[def.key] = def.key in values ? values[def.key] : def.default;
  }

  return { values: safeValues, errors, warnings, ok: errors.length === 0 };
}

export default parseSlimeAttrs;
