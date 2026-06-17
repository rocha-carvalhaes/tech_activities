// Parser do sandbox da Fábrica de Fases (cópia adaptada do Slime Aventureiro).
// 4 params escalares (size/color/jump/speed) + caixas repetíveis `box = (col, row)`
// + objetivo `goal = (col, row)`. Retorna { values, errors, warnings, ok }, onde
// values = { size, color, jump, speed, boxes: [{col,row}], goal: {col,row} }.
import { ATTR_DEFS, START_COL } from './constants';
import { isValidCssColor } from '../shared/cssColor';

const DEFS_BY_KEY = Object.fromEntries(ATTR_DEFS.map((d) => [d.key, d]));
const SCALAR_KEYS = ATTR_DEFS.map((d) => d.key);
const KNOWN_KEYS = [...SCALAR_KEYS, 'box', 'goal'];
const TUPLE_RE = /^\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/;

function clamp(n, min, max) {
  if (typeof min === 'number' && n < min) return min;
  if (typeof max === 'number' && n > max) return max;
  return n;
}

// Lê "(col, row)" → { col, row } ou null se inválido (formato/inteiros/negativos).
function parseTuple(rawValue) {
  const m = rawValue.match(TUPLE_RE);
  if (!m) return null;
  const col = Number(m[1]);
  const row = Number(m[2]);
  if (col < 0 || row < 0) return null;
  return { col, row };
}

export function parseLevel(code) {
  const errors = [];
  const warnings = [];
  const scalars = {};
  const boxes = [];
  let goal = null;
  const seen = new Set();

  const lines = String(code ?? '').split('\n');

  lines.forEach((raw, i) => {
    const lineNo = i + 1;
    const line = raw.replace(/#.*$/, '').trim();
    if (line === '') return;

    const eq = line.indexOf('=');
    if (eq === -1) {
      errors.push({ line: lineNo, key: null, message: `Linha ${lineNo}: use o formato "atributo = valor".` });
      return;
    }

    const key = line.slice(0, eq).trim();
    const rawValue = line.slice(eq + 1).trim();

    if (!KNOWN_KEYS.includes(key)) {
      errors.push({
        line: lineNo,
        key,
        message: `Linha ${lineNo}: não conheço "${key}". Use: ${KNOWN_KEYS.join(', ')}.`,
      });
      return;
    }

    // Caixas: repetíveis.
    if (key === 'box') {
      const t = parseTuple(rawValue);
      if (!t) {
        errors.push({
          line: lineNo,
          key,
          message: `Linha ${lineNo}: box precisa de dois inteiros ≥ 0 entre parênteses, ex.: box = (2, 3).`,
        });
        return;
      }
      boxes.push(t);
      return;
    }

    // Objetivo: único.
    if (key === 'goal') {
      const t = parseTuple(rawValue);
      if (!t) {
        errors.push({
          line: lineNo,
          key,
          message: `Linha ${lineNo}: goal precisa de dois inteiros ≥ 0 entre parênteses, ex.: goal = (10, 0).`,
        });
        return;
      }
      if (goal) warnings.push({ key, message: 'goal aparece mais de uma vez; usei o último.' });
      goal = t;
      return;
    }

    // Escalares (size/color/jump/speed).
    if (seen.has(key)) {
      warnings.push({ key, message: `"${key}" aparece mais de uma vez; usei o último valor.` });
    }
    seen.add(key);
    const def = DEFS_BY_KEY[key];

    if (def.type === 'color') {
      const cm = rawValue.match(/^"([^"]*)"$|^'([^']*)'$/);
      if (!cm) {
        errors.push({ line: lineNo, key, message: `Linha ${lineNo}: color é um texto e precisa de aspas, ex.: color = "teal".` });
        return;
      }
      const colorStr = cm[1] ?? cm[2] ?? '';
      if (!isValidCssColor(colorStr)) {
        errors.push({ line: lineNo, key, message: `Linha ${lineNo}: "${colorStr}" não é uma cor reconhecida.` });
        return;
      }
      scalars[key] = colorStr;
      return;
    }

    if (rawValue === '' || !/^[-+]?\d*\.?\d+$/.test(rawValue)) {
      errors.push({ line: lineNo, key, message: `Linha ${lineNo}: ${key} deve ser um número.` });
      return;
    }
    const num = Number(rawValue);
    if (def.type === 'int' && !Number.isInteger(num)) {
      errors.push({ line: lineNo, key, message: `Linha ${lineNo}: ${key} deve ser um número inteiro (sem casas decimais). Você escreveu ${rawValue}.` });
      return;
    }
    const cl = clamp(num, def.min, def.max);
    if (cl !== num) {
      warnings.push({ key, message: `${key} foi ajustado para ${cl} (válido entre ${def.min} e ${def.max}).` });
    }
    scalars[key] = cl;
  });

  // Escalares obrigatórios.
  for (const def of ATTR_DEFS) {
    if (!(def.key in scalars) && !errors.some((e) => e.key === def.key)) {
      errors.push({ line: null, key: def.key, message: `Faltou definir "${def.key}".` });
    }
  }

  // values seguros (defaults quando faltando), para o preview nunca quebrar.
  const safe = {};
  for (const def of ATTR_DEFS) {
    safe[def.key] = def.key in scalars ? scalars[def.key] : def.default;
  }
  safe.boxes = boxes;
  // goal default: algumas colunas após o ponto mais à direita.
  const rightmost = boxes.reduce((mx, b) => Math.max(mx, b.col), START_COL);
  safe.goal = goal ?? { col: rightmost + 3, row: 0 };

  return { values: safe, errors, warnings, ok: errors.length === 0 };
}

export default parseLevel;
