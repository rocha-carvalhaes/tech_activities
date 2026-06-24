import { useEffect, useMemo, useRef, useState } from 'react';
import { sample, shuffleArray } from './shuffle';

const PAIR_COUNT = 8; // 8 pares = 16 cartas (grade 4×4), sorteados do pool de 16

// Jogo da memória: vire as cartas e ache os pares de emojis do tema. Casa todos
// os pares → conclui.
function MemoryGame({ theme, onComplete }) {
  // Baralho gerado uma vez por montagem (= uma vez por circuito).
  const deck = useMemo(() => {
    const chosen = sample(theme.pairs, PAIR_COUNT);
    const cards = chosen.flatMap((key) => [key, key]);
    return shuffleArray(cards).map((key, uid) => ({ uid, key }));
  }, [theme]);

  const [flipped, setFlipped] = useState([]); // uids virados agora (até 2)
  const [matched, setMatched] = useState(() => new Set());
  const [lock, setLock] = useState(false);
  const doneRef = useRef(false);

  const onPick = (uid) => {
    if (lock || matched.has(uid) || flipped.includes(uid)) return;

    if (flipped.length === 0) {
      setFlipped([uid]);
      return;
    }

    const firstUid = flipped[0];
    setFlipped([firstUid, uid]);
    setLock(true);

    const isMatch = deck[firstUid].key === deck[uid].key;
    setTimeout(() => {
      if (isMatch) {
        setMatched((prev) => {
          const next = new Set(prev);
          next.add(firstUid);
          next.add(uid);
          return next;
        });
      }
      setFlipped([]);
      setLock(false);
    }, isMatch ? 350 : 800);
  };

  useEffect(() => {
    if (doneRef.current) return;
    if (matched.size === deck.length && deck.length > 0) {
      doneRef.current = true;
      const t = setTimeout(() => onComplete(), 400);
      return () => clearTimeout(t);
    }
  }, [matched, deck, onComplete]);

  const pairsFound = matched.size / 2;

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-[#777777]">
        Vire as cartas e encontre os pares iguais. ({pairsFound}/{deck.length / 2})
      </p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {deck.map((card) => {
          const isUp = flipped.includes(card.uid) || matched.has(card.uid);
          const isMatched = matched.has(card.uid);
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => onPick(card.uid)}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-3xl sm:text-4xl shadow-sm transition-all ${
                isUp
                  ? isMatched
                    ? 'bg-[#B8E3C0] scale-95'
                    : 'bg-white border border-[#D9D9D9]'
                  : 'bg-gradient-to-br from-[#B8E3C0] to-[#E6A8D7] hover:brightness-105 cursor-pointer'
              }`}
              aria-label={isUp ? card.key : 'carta virada'}
            >
              {isUp ? card.key : <span className="text-white/90 text-2xl font-bold">?</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MemoryGame;
