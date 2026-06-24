import { useEffect, useMemo, useRef, useState } from 'react';
import { generateWordSearch } from './wordSearchGrid';
import { sample } from './shuffle';

const SIZE = 10;
const WORD_COUNT = 7;

// Caça-palavras: grade 10×10 com ~7 palavras do tema (sorteadas do pool). O aluno
// arrasta o mouse em linha reta para marcar uma palavra; encontra todas → conclui.
function WordSearch({ theme, onComplete }) {
  // Gera a grade uma vez por montagem (= uma vez por circuito).
  const { grid, words } = useMemo(() => {
    const fitting = theme.words.filter((w) => w.length <= SIZE);
    const chosen = sample(fitting, WORD_COUNT);
    return generateWordSearch(chosen, SIZE);
  }, [theme]);

  const [foundWords, setFoundWords] = useState(() => new Set());
  const [foundCells, setFoundCells] = useState(() => new Set());
  const [selCells, setSelCells] = useState([]);

  const selectingRef = useRef(false);
  const startRef = useRef(null);
  const selCellsRef = useRef([]);
  const doneRef = useRef(false);

  const setSel = (cells) => {
    selCellsRef.current = cells;
    setSelCells(cells);
  };

  // Linha reta (→ ↓ ↘ ↙ etc.) entre start e end; null se não for reta.
  const lineBetween = (start, end) => {
    const dr = Math.sign(end.r - start.r);
    const dc = Math.sign(end.c - start.c);
    const rs = Math.abs(end.r - start.r);
    const cs = Math.abs(end.c - start.c);
    const straight = start.r === end.r || start.c === end.c || rs === cs;
    if (!straight) return null;
    const len = Math.max(rs, cs);
    const cells = [];
    for (let k = 0; k <= len; k++) cells.push(`${start.r + dr * k},${start.c + dc * k}`);
    return cells;
  };

  const readWord = (cells) =>
    cells.map((key) => {
      const [r, c] = key.split(',').map(Number);
      return grid[r][c];
    }).join('');

  const finalize = () => {
    if (!selectingRef.current) return;
    selectingRef.current = false;
    const cells = selCellsRef.current;
    setSel([]);
    if (cells.length < 2) return;

    const str = readWord(cells);
    const reversed = str.split('').reverse().join('');
    const match = words.find((w) => (w === str || w === reversed) && !foundWords.has(w));
    if (match) {
      setFoundWords((prev) => new Set(prev).add(match));
      setFoundCells((prev) => {
        const next = new Set(prev);
        cells.forEach((c) => next.add(c));
        return next;
      });
    }
  };

  // Finaliza a seleção mesmo se o mouse soltar fora da grade.
  useEffect(() => {
    const onUp = () => finalize();
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, foundWords, grid]);

  // Conclusão.
  useEffect(() => {
    if (doneRef.current) return;
    if (words.length > 0 && foundWords.size === words.length) {
      doneRef.current = true;
      onComplete();
    }
  }, [foundWords, words, onComplete]);

  const startSel = (r, c) => {
    selectingRef.current = true;
    startRef.current = { r, c };
    setSel([`${r},${c}`]);
  };

  const moveSel = (r, c) => {
    if (!selectingRef.current || !startRef.current) return;
    const line = lineBetween(startRef.current, { r, c });
    if (line) setSel(line);
  };

  const selSet = new Set(selCells);

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <p className="text-sm text-[#777777]">
        Arraste o mouse sobre as letras para marcar as palavras do tema.
      </p>

      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* grade */}
        <div
          className="grid bg-white rounded-2xl border border-[#D9D9D9] p-2 shadow-sm"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
          onMouseLeave={() => {}}
        >
          {grid.map((row, r) =>
            row.map((letter, c) => {
              const key = `${r},${c}`;
              const isFound = foundCells.has(key);
              const isSel = selSet.has(key);
              return (
                <div
                  key={key}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    startSel(r, c);
                  }}
                  onMouseEnter={() => moveSel(r, c)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center font-mono font-bold text-sm rounded-md cursor-pointer transition-colors ${
                    isFound
                      ? 'bg-[#B8E3C0] text-[#1e3a24]'
                      : isSel
                        ? 'bg-[#E6A8D7] text-white'
                        : 'text-[#333] hover:bg-[#F5F6F7]'
                  }`}
                >
                  {letter}
                </div>
              );
            })
          )}
        </div>

        {/* palavras a encontrar */}
        <div className="min-w-[140px]">
          <h3 className="text-sm font-semibold text-[#333] mb-2">
            Palavras ({foundWords.size}/{words.length})
          </h3>
          <ul className="flex flex-wrap lg:flex-col gap-x-3 gap-y-1">
            {words.map((w) => (
              <li
                key={w}
                className={`font-mono text-sm ${
                  foundWords.has(w) ? 'text-[#A4D4AE] line-through' : 'text-[#555]'
                }`}
              >
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default WordSearch;
