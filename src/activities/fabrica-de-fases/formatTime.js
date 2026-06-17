// Formata milissegundos para um cronômetro legível.
//   < 1 min  → "12.34s"
//   ≥ 1 min  → "1:05.20"
// Usa centésimos de segundo (2 casas) para diferenciar tempos próximos no ranking.
export function formatTime(ms) {
  const totalCs = Math.max(0, Math.round(Number(ms) / 10)); // centésimos
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);
  const pad = (n) => String(n).padStart(2, '0');
  if (min > 0) return `${min}:${pad(sec)}.${pad(cs)}`;
  return `${sec}.${pad(cs)}s`;
}

export default formatTime;
