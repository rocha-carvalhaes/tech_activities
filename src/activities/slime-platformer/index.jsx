import { useState, useMemo, useCallback } from 'react';
import ActivityShell from '../../components/ActivityShell.jsx';
import CodeEditor from '../shared/CodeEditor';
import GameScene from './GameScene';
import parseLevel from './parseLevel';
import { DEFAULT_CODE } from './constants';

// Plataformer lateral: o aluno edita o personagem E desenha a fase por código
// (caixas + objetivo). Sandbox único — quem escreve as caixas faz a fase; para
// compartilhar uma fase, basta compartilhar o texto do código.
function SlimePlatformer({ onBack }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [running, setRunning] = useState(false);
  const [runValues, setRunValues] = useState(null);

  const parsed = useMemo(() => parseLevel(code), [code]);

  const startGame = useCallback(() => {
    if (!parsed.ok) return;
    setRunValues(parsed.values);
    setRunning(true);
  }, [parsed.ok, parsed.values]);

  const stopGame = useCallback(() => setRunning(false), []);
  const handleWin = useCallback(() => setRunning(false), []);

  const sceneValues = running && runValues ? runValues : parsed.values;

  return (
    <ActivityShell
      title="Slime Aventureiro"
      subtitle="Edite o personagem e a fase por código — depois jogue."
      onBack={onBack}
    >
      <p className="text-sm text-[#555555] mb-4 max-w-3xl">
        Ajuste o personagem (<code>size</code>, <code>color</code>, <code>jump</code>,{' '}
        <code>speed</code>) e monte a fase com caixas: <code>box = (coluna, linha)</code>.
        O slime não atravessa caixas — elas viram degraus e tetos, então nem sempre o{' '}
        <strong>maior pulo</strong> é o melhor. Chegue na ⭐ à direita. Compartilhe uma
        fase copiando o código.
      </p>

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
          attrs={sceneValues}
          running={running}
          onWin={handleWin}
          onPlayAgain={startGame}
        />
      </div>
    </ActivityShell>
  );
}

export default SlimePlatformer;
