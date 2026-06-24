import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffleArray } from './shuffle';

// Desembaralhar: uma frase do tema (sorteada do pool) vem com as palavras fora de
// ordem; o aluno arrasta para reordenar. Ordem certa → conclui. Drag-and-drop
// nativo do HTML5 (sem libs), no mesmo espírito do componente da Dataduca.
function Unscramble({ theme, onComplete }) {
  const { correctOrder, initial } = useMemo(() => {
    const phrase = theme.phrases[Math.floor(Math.random() * theme.phrases.length)];
    const words = phrase.split(' ');
    const items = words.map((word, id) => ({ id, word }));
    return { correctOrder: words, initial: shuffleArray(items) };
  }, [theme]);

  const [items, setItems] = useState(initial);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const doneRef = useRef(false);

  const isCorrect = items.every((it, i) => it.word === correctOrder[i]);

  useEffect(() => {
    if (doneRef.current) return;
    if (isCorrect) {
      doneRef.current = true;
      const t = setTimeout(() => onComplete(), 900);
      return () => clearTimeout(t);
    }
  }, [isCorrect, onComplete]);

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm text-[#777777]">
        Arraste as palavras para montar a frase na ordem certa.
      </p>

      <div className="flex flex-wrap justify-center gap-2 max-w-[640px]">
        {items.map((it, index) => (
          <div
            key={it.id}
            draggable={!isCorrect}
            onDragStart={() => setDraggedIndex(index)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverIndex(index);
            }}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(index);
            }}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
            className={`px-4 py-3 rounded-xl font-semibold text-lg transition-all ${
              isCorrect
                ? 'bg-[#B8E3C0] text-[#1e3a24]'
                : draggedIndex === index
                  ? 'bg-[#E6A8D7] text-white scale-105 cursor-grabbing'
                  : dragOverIndex === index
                    ? 'bg-[#F6E5A1] text-[#5a4a14] border-2 border-dashed border-[#d8b94a] cursor-grab'
                    : 'bg-white border border-[#D9D9D9] text-[#333] hover:border-[#E6A8D7] cursor-grab'
            }`}
          >
            {it.word}
          </div>
        ))}
      </div>

      {isCorrect && (
        <p className="text-sm font-semibold text-[#1e3a24]">Frase correta! 🎉</p>
      )}
    </div>
  );
}

export default Unscramble;
