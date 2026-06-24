// Gerador puro da grade do caça-palavras. Posiciona as palavras só na horizontal
// (→) e na vertical (↓), sem conflito (células vazias ou com a mesma letra), e
// preenche o resto com letras aleatórias. Sem React — fácil de raciocinar/testar.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIRECTIONS = [
  { dr: 0, dc: 1 }, // →
  { dr: 1, dc: 0 }, // ↓
];

function randInt(n) {
  return Math.floor(Math.random() * n);
}

export function generateWordSearch(words, size = 10) {
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const placements = [];

  for (const word of words) {
    if (word.length > size) continue; // não cabe na grade
    let placed = false;
    for (let attempt = 0; attempt < 80 && !placed; attempt++) {
      const dir = DIRECTIONS[randInt(DIRECTIONS.length)];
      const maxR = dir.dr ? size - word.length : size - 1;
      const maxC = dir.dc ? size - word.length : size - 1;
      const r0 = randInt(maxR + 1);
      const c0 = randInt(maxC + 1);

      let fits = true;
      for (let k = 0; k < word.length; k++) {
        const cur = grid[r0 + dir.dr * k][c0 + dir.dc * k];
        if (cur !== null && cur !== word[k]) {
          fits = false;
          break;
        }
      }
      if (!fits) continue;

      const cells = [];
      for (let k = 0; k < word.length; k++) {
        const rr = r0 + dir.dr * k;
        const cc = c0 + dir.dc * k;
        grid[rr][cc] = word[k];
        cells.push(`${rr},${cc}`);
      }
      placements.push({ word, cells });
      placed = true;
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) grid[r][c] = ALPHABET[randInt(26)];
    }
  }

  return { grid, placements, words: placements.map((p) => p.word) };
}

export default generateWordSearch;
