// Progresso das fases do Slime Aventureiro em localStorage, com TTL de 10 min.
//
// Janela DESLIZANTE: cada gravação renova o `ts`. Se passar 10 min sem nenhuma
// conclusão, a leitura expira e volta ao default (só a fase 1 desbloqueada) —
// um reset natural entre turmas/aulas.

const KEY = 'slime-platformer:progress';
const TTL_MS = 30 * 60 * 1000;

function defaultProgress() {
  return { unlocked: 1, completed: [] };
}

// { unlocked, completed: number[] } — sem o `ts` interno.
export function readProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress();
    const data = JSON.parse(raw);
    if (!data || typeof data.ts !== 'number' || Date.now() - data.ts > TTL_MS) {
      return defaultProgress();
    }
    return {
      unlocked: typeof data.unlocked === 'number' ? data.unlocked : 1,
      completed: Array.isArray(data.completed) ? data.completed : [],
    };
  } catch {
    return defaultProgress();
  }
}

export function writeProgress(p) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ unlocked: p.unlocked, completed: p.completed, ts: Date.now() })
    );
  } catch {
    // localStorage indisponível (modo privado etc.) — segue sem persistir.
  }
}

// Marca a fase como concluída, desbloqueia a próxima e retorna o novo progresso.
export function markComplete(level) {
  const prev = readProgress();
  const completed = prev.completed.includes(level)
    ? prev.completed
    : [...prev.completed, level];
  const next = {
    unlocked: Math.max(prev.unlocked, level + 1),
    completed,
  };
  writeProgress(next);
  return next;
}

export default readProgress;
