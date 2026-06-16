import { useState, useMemo, useCallback } from 'react';
import ActivityShell from '../../components/ActivityShell.jsx';
import CodeEditor from '../shared/CodeEditor';
import GameScene from './GameScene';
import parseAttrs from './parseAttrs';
import { DEFAULT_CODE } from './constants';

// Editor de código e jogo na MESMA tela, lado a lado: painel de código vertical à
// esquerda, cena do jogo à direita (mesma altura). Um botão Play/Stop comanda o
// jogo. Parado, a cena mostra o slime "pronto" como preview ao vivo dos atributos.
function CharacterJump({ onBack }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [running, setRunning] = useState(false);

  const parsed = useMemo(() => parseAttrs(code), [code]);

  const startGame = useCallback(() => {
    if (!parsed.ok) return;
    setRunning(true);
  }, [parsed.ok]);

  const stopGame = useCallback(() => setRunning(false), []);
  const handleGameOver = useCallback(() => setRunning(false), []);

  // Atributos sempre ao vivo: editar o código reflete imediatamente no jogo.
  const sceneAttrs = parsed.values;

  return (
    <ActivityShell
      title="Personagem Saltador"
      subtitle="Edite o personagem por código e jogue — na mesma tela."
      onBack={onBack}
    >
      <p className="text-sm text-[#555555] mb-4 max-w-2xl">
        Mude os atributos no código à esquerda (<code>size</code>, <code>color</code>,{' '}
        <code>jump</code>, <code>speed</code>) e veja o personagem mudar na hora. Aperte{' '}
        <strong>Play</strong> para jogar e use as setas <strong>← →</strong> para subir
        entre as plataformas.
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:justify-center">
        <CodeEditor
          code={code}
          onCodeChange={setCode}
          parsed={parsed}
          running={running}
          onPlay={startGame}
          onStop={stopGame}
        />
        <GameScene
          attrs={sceneAttrs}
          running={running}
          onGameOver={handleGameOver}
        />
      </div>
    </ActivityShell>
  );
}

export default CharacterJump;
