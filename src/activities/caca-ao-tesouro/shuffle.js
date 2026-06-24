// Utilitários de aleatoriedade usados pelos mini-jogos (memória e desembaralhar)
// e pela seleção de subconjuntos dos pools dos temas.

// Embaralha (Fisher-Yates) garantindo, quando possível, uma ordem DIFERENTE da
// original — senão um desembaralhar poderia "nascer" já resolvido.
export function shuffleArray(array) {
  const arr = [...array];
  if (arr.length <= 1) return arr;

  let attempts = 0;
  let shuffled;
  do {
    shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    attempts++;
    const isDifferent = shuffled.some((v, i) => v !== arr[i]);
    if (isDifferent) break;
  } while (attempts < 50);

  return shuffled;
}

// Sorteia `n` itens distintos de um array (sem repetir). Se `n` ≥ tamanho,
// devolve o array inteiro embaralhado.
export function sample(array, n) {
  return shuffleArray(array).slice(0, Math.max(0, n));
}

// Inteiro aleatório no intervalo [min, max] (inclusive).
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
