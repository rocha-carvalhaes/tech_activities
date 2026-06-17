import { useState, useMemo, useCallback } from 'react';
import ActivityShell from '../../components/ActivityShell.jsx';
import CodeEditor from '../shared/CodeEditor';
import GameScene from './GameScene';
import LevelSelect from './LevelSelect';
import parseLevel from './parseLevel';
import { LEVELS } from './levels';
import { readProgress, markComplete } from './progress';

// Plataformer lateral em 10 fases. A entrada é a grade de fases; ao escolher uma,
// o aluno cai no editor (sandbox: tudo editável) e joga. Concluir desbloqueia a
// próxima. Progresso em localStorage com TTL de 30 min (ver progress.js).
function SlimePlatformer({ onBack }) {
  const [progress, setProgress] = useState(() => readProgress());
  const [level, setLevel] = useState(null); // null = tela de seleção
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);

  const parsed = useMemo(() => parseLevel(code), [code]);

  const pickLevel = useCallback((lvl) => {
    setLevel(lvl);
    setCode(lvl.code);
    setRunning(false);
  }, []);

  const backToLevels = useCallback(() => {
    setRunning(false);
    setLevel(null);
    setProgress(readProgress());
  }, []);

  const startGame = useCallback(() => {
    if (!parsed.ok) return;
    setRunning(true);
  }, [parsed.ok]);

  const stopGame = useCallback(() => setRunning(false), []);

  const handleWin = useCallback(() => {
    setRunning(false);
    if (level) setProgress(markComplete(level.id));
  }, [level]);

  const nextLevel = useMemo(
    () => (level ? LEVELS.find((l) => l.id === level.id + 1) : null),
    [level]
  );

  const goToNext = useCallback(() => {
    if (nextLevel) pickLevel(nextLevel);
  }, [nextLevel, pickLevel]);

  if (!level) {
    return (
      <ActivityShell
        title="Slime Aventureiro"
        subtitle="10 fases para escalar, espremer e correr — editando o código."
        onBack={onBack}
      >
        <LevelSelect progress={progress} onPick={pickLevel} />
      </ActivityShell>
    );
  }

  const sceneValues = parsed.values;

  return (
    <ActivityShell
      title="Slime Aventureiro"
      subtitle="Edite o personagem e a fase por código — depois jogue."
      onBack={onBack}
    >
      <div className="flex items-center justify-between gap-3 mb-3 max-w-3xl">
        <div>
          <h2 className="text-lg font-semibold text-[#333333]">
            Fase {level.id}: {level.name}
          </h2>
          <p className="text-sm text-[#555555]">{level.hint}</p>
        </div>
        <button
          type="button"
          onClick={backToLevels}
          className="shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium text-[#333333] bg-white border border-[#D9D9D9] hover:bg-[#f1faf3] hover:border-[#9bbf9f]"
        >
          ← Fases
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:justify-center">
        <CodeEditor
          code={code}
          onCodeChange={setCode}
          parsed={parsed}
          running={running}
          onPlay={startGame}
          onStop={stopGame}
          filename="fase.code"
        />
        <GameScene
          key={level.id}
          attrs={sceneValues}
          running={running}
          onWin={handleWin}
          onPlayAgain={startGame}
          onNext={nextLevel ? goToNext : null}
          hasNext={!!nextLevel}
          onBackToLevels={backToLevels}
        />
      </div>
    </ActivityShell>
  );
}

export default SlimePlatformer;
