import { useMemo, useRef, useState } from 'react';
import ActivityShell from '../../components/ActivityShell.jsx';
import ThemePicker from './ThemePicker';
import NumberTracker from './NumberTracker';
import WordSearch from './WordSearch';
import MemoryGame from './MemoryGame';
import Unscramble from './Unscramble';
import TreasureScreen from './TreasureScreen';
import SlimeCompanion from './SlimeCompanion';
import RankingModal from './RankingModal';
import { getTheme } from './themes';
import { parseSlimeAttrs } from './parseSlimeAttrs';
import { DEFAULT_SLIME_CODE } from './slimeConstants';
import { randomInt } from './shuffle';

// Caça ao Tesouro: o aluno escolhe um TEMA e passa por 3 estações (caça-palavras,
// memória, desembaralhar). Cada estação revela um número (sorteado por partida)
// que acende no tracker do canto. Com os 3 números, abre o cadeado do baú. No fim,
// ranking por tempo (geral + por tema). Um slime companion (canto inferior
// esquerdo) acompanha o mouse e pode ser customizado por código — só por diversão.
function CacaAoTesouro({ onBack }) {
  const [phase, setPhase] = useState('theme'); // theme | st0 | st1 | st2 | treasure | done
  const [themeId, setThemeId] = useState(null);
  const [code, setCode] = useState([]); // 3 dígitos sorteados por partida
  const [collected, setCollected] = useState([null, null, null]);
  const [cleared, setCleared] = useState(null); // { digit, nextPhase } — overlay de estação concluída
  const [elapsedMs, setElapsedMs] = useState(0);

  // Slime companion: o código (texto) é a fonte da verdade; os valores derivam dele.
  const [slimeCode, setSlimeCode] = useState(DEFAULT_SLIME_CODE);
  const slimeValues = useMemo(() => parseSlimeAttrs(slimeCode).values, [slimeCode]);

  const startTimeRef = useRef(0);
  const theme = themeId ? getTheme(themeId) : null;

  const startCircuit = (id) => {
    setThemeId(id);
    setCode(Array.from({ length: 3 }, () => randomInt(0, 9)));
    setCollected([null, null, null]);
    setCleared(null);
    startTimeRef.current = performance.now();
    setPhase('st0');
  };

  const completeStation = (i) => {
    setCollected((prev) => {
      const next = [...prev];
      next[i] = code[i];
      return next;
    });
    setCleared({ digit: code[i], nextPhase: i < 2 ? `st${i + 1}` : 'treasure' });
  };

  const nextAfterClear = () => {
    const next = cleared?.nextPhase ?? 'treasure';
    setCleared(null);
    setPhase(next);
  };

  const solveTreasure = () => {
    setElapsedMs(performance.now() - startTimeRef.current);
    setPhase('done');
  };

  const resetToTheme = () => {
    setPhase('theme');
    setThemeId(null);
    setCode([]);
    setCollected([null, null, null]);
    setCleared(null);
  };

  const inCircuit = phase === 'st0' || phase === 'st1' || phase === 'st2' || phase === 'treasure';
  const handleBack = phase === 'theme' ? onBack : resetToTheme;

  return (
    <ActivityShell
      title="Caça ao Tesouro"
      subtitle="Passe pelas estações, colete os números e abra o baú."
      onBack={handleBack}
    >
      <div className="relative min-h-[560px]">
        {inCircuit && <NumberTracker collected={collected} />}

        <div className="pt-16">
          {phase === 'theme' && <ThemePicker onPick={startCircuit} />}
          {phase === 'st0' && theme && <WordSearch theme={theme} onComplete={() => completeStation(0)} />}
          {phase === 'st1' && theme && <MemoryGame theme={theme} onComplete={() => completeStation(1)} />}
          {phase === 'st2' && theme && <Unscramble theme={theme} onComplete={() => completeStation(2)} />}
          {phase === 'treasure' && <TreasureScreen code={code} onSolved={solveTreasure} />}
        </div>

        {cleared && <StationCleared digit={cleared.digit} onNext={nextAfterClear} />}

        <SlimeCompanion values={slimeValues} code={slimeCode} onCodeChange={setSlimeCode} />

        {phase === 'done' && theme && (
          <RankingModal
            themeId={theme.id}
            themeLabel={theme.label}
            themeEmoji={theme.emoji}
            elapsedMs={elapsedMs}
            onContinue={resetToTheme}
          />
        )}
      </div>
    </ActivityShell>
  );
}

// Overlay entre estações: mostra o número recém-encontrado e segue para a próxima.
function StationCleared({ digit, onNext }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
      <div className="ff-pop text-center bg-white rounded-2xl border border-[#D9D9D9] shadow-xl px-8 py-7">
        <p className="text-sm text-[#777]">Você encontrou um número!</p>
        <div className="my-3 mx-auto w-20 h-24 rounded-xl bg-[#B8E3C0] border border-[#9bcf8f] flex items-center justify-center">
          <span className="text-5xl font-mono font-bold text-[#1e3a24]">{digit}</span>
        </div>
        <p className="text-xs text-[#777] mb-4">Ele foi guardado no código, no canto da tela.</p>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 rounded-xl font-semibold text-[#1e3a24] bg-[#B8E3C0] hover:bg-[#a7d9b2] shadow-sm"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default CacaAoTesouro;
