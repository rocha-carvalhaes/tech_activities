// Lê o "código" do aluno (linhas `chave = valor`) e valida o TIPO de cada
// atributo. O valor pedagógico está aqui: erros de tipo são amigáveis e explícitos.
//
// Retorna { values, errors, warnings, ok }:
//   values   — objeto com os 4 atributos (já com clamp aplicado nos numéricos)
//   errors   — lista [{ line, key, message }] que BLOQUEIA o Play
//   warnings — lista [{ key, message }] não bloqueante (ex.: valor fora da faixa)
//   ok       — true se não houver erros
import { ATTR_DEFS } from './constants';
import { isValidCssColor } from '../shared/cssColor';

const DEFS_BY_KEY = Object.fromEntries(ATTR_DEFS.map((d) => [d.key, d]));
const KNOWN_KEYS = ATTR_DEFS.map((d) => d.key);

function clamp(n, min, max) {
  if (typeof min === 'number' && n < min) return min;
  if (typeof max === 'number' && n > max) return max;
  return n;
}

export function parseAttrs(code) {
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
      errors.push({
        line: lineNo,
        key: null,
        message: `Linha ${lineNo}: use o formato "atributo = valor".`,
      });
      return;
    }

    const key = line.slice(0, eq).trim();
    const rawValue = line.slice(eq + 1).trim();

    if (!KNOWN_KEYS.includes(key)) {
      errors.push({
        line: lineNo,
        key,
        message: `Linha ${lineNo}: não conheço o atributo "${key}". Use: ${KNOWN_KEYS.join(', ')}.`,
      });
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
        errors.push({
          line: lineNo,
          key,
          message: `Linha ${lineNo}: color é um texto e precisa de aspas, ex.: color = "teal".`,
        });
        return;
      }
      const colorStr = m[1] ?? m[2] ?? '';
      if (!isValidCssColor(colorStr)) {
        errors.push({
          line: lineNo,
          key,
          message: `Linha ${lineNo}: "${colorStr}" não é uma cor reconhecida. Tente nomes como "teal", "tomato" ou "#7c3aed".`,
        });
        return;
      }
      values[key] = colorStr;
      return;
    }

    // Numéricos: int e float.
    if (rawValue === '' || !/^[-+]?\d*\.?\d+$/.test(rawValue)) {
      errors.push({
        line: lineNo,
        key,
        message: `Linha ${lineNo}: ${key} deve ser um número.`,
      });
      return;
    }

    const num = Number(rawValue);
    if (def.type === 'int' && !Number.isInteger(num)) {
      errors.push({
        line: lineNo,
        key,
        message: `Linha ${lineNo}: ${key} deve ser um número inteiro (sem casas decimais). Você escreveu ${rawValue}.`,
      });
      return;
    }

    const clamped = clamp(num, def.min, def.max);
    if (clamped !== num) {
      warnings.push({
        key,
        message: `${key} foi ajustado para ${clamped} (válido entre ${def.min} e ${def.max}).`,
      });
    }
    values[key] = clamped;
  });

  // Atributos faltando → erro (com default não dá pra "ensinar" o que falta).
  for (const def of ATTR_DEFS) {
    if (!(def.key in values) && !errors.some((e) => e.key === def.key)) {
      errors.push({
        line: null,
        key: def.key,
        message: `Faltou definir "${def.key}".`,
      });
    }
  }

  // Garante que values tenha todas as chaves (usa default quando inválido/faltando),
  // para o preview nunca quebrar mesmo com erros presentes.
  const safeValues = {};
  for (const def of ATTR_DEFS) {
    safeValues[def.key] = def.key in values ? values[def.key] : def.default;
  }

  return { values: safeValues, errors, warnings, ok: errors.length === 0 };
}

export default parseAttrs;
