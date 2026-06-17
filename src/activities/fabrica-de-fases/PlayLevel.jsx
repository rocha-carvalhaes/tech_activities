import { useState, useMemo, useCallback, useRef } from 'react';
import CodeEditor from '../shared/CodeEditor';
import GameScene from './GameScene';
import TimeRankingModal from './TimeRankingModal';
import parseLevel from './parseLevel';

// Joga uma fase publicada. O painel de código fica SEMPRE visível e editável — o
// aluno pode ler/mexer no código a qualquer momento, inclusive durante uma run
// (as mudanças valem no próximo Play, modelo de snapshot como no resto do app).
// O cronômetro começa no Play e para na estrela; ao vencer abre o ranking de tempo.
//
// Integridade do ranking: o tempo só conta quando o código jogado é IDÊNTICO ao
// publicado. Se o aluno modificou a fase, a vitória é celebrada mas não entra no
// ranking (senão dava para trivializar a fase e poluir o placar compartilhado).
function PlayLevel({ level, onBackToList }) {
  const [code, setCode] = useState(level.code);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [timeMs, setTimeMs] = useState(0);
  const [runModified, setRunModified] = useState(false);
  const [runValues, setRunValues] = useState(null);
  const runCodeRef = useRef(level.code);

  const parsed = useMemo(() => parseLevel(code), [code]);

  const start = useCallback(() => {
    if (!parsed.ok) return;
    setRunValues(parsed.values);
    runCodeRef.current = code; // congela o código jogado nesta run
    setWon(false);
    setRunning(true);
  }, [parsed.ok, parsed.values, code]);

  const stop = useCallback(() => setRunning(false), []);

  const handleWin = useCallback(
    (elapsedMs) => {
      setTimeMs(elapsedMs);
      setRunModified(runCodeRef.current !== level.code);
      setRunning(false);
      setWon(true);
    },
    [level.code]
  );

  const sceneValues = running && runValues ? runValues : parsed.values;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[#555555] max-w-3xl">
        Veja e edite o código desta fase à esquerda. Aperte <strong>Play</strong>, mova com{' '}
        <strong>← →</strong> e pule com <strong>↑/espaço</strong> para chegar na ⭐ — o
        cronômetro começa no Play. Você pode mexer no código quando quiser; as mudanças valem
        no próximo Play (fases modificadas não entram no ranking).
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:justify-center">
        {/* Wrapper relativo: no desktop o editor (md:absolute) preenche este
            wrapper, que estica (items-stretch) até a altura da cena do jogo. */}
        <div className="relative w-full max-w-[360px]">
          <CodeEditor
            code={code}
            onCodeChange={setCode}
            parsed={parsed}
            running={running}
            onPlay={start}
            onStop={stop}
            filename="fase.code"
            fitHeight
          />
        </div>
        <GameScene attrs={sceneValues} running={running} onWin={handleWin} />
      </div>

      {won && (
        <TimeRankingModal
          levelId={level.id}
          levelName={level.name}
          timeMs={timeMs}
          modified={runModified}
          onPlayAgain={start}
          onBackToList={onBackToList}
        />
      )}
    </div>
  );
}

export default PlayLevel;
