import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import Slime from '../shared/Slime';
import { GameEngine } from './engine';
import GameOverModal from './GameOverModal';
import { poseFromState } from '../shared/slimePoses';
import {
  SCENE_WIDTH,
  SCENE_HEIGHT,
  PLATFORM_WIDTH,
  PLATFORM_HEIGHT,
  slimeRadius,
} from './constants';

// Pool fixo de plataformas reaproveitadas (evita criar/remover nós a 60fps).
const POOL = 14;
const LEFT_KEYS = new Set(['ArrowLeft', 'a', 'A']);
const RIGHT_KEYS = new Set(['ArrowRight', 'd', 'D']);
const BLOCK_SCROLL = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ']);

// Painel do jogo (mesmas dimensões da cena). Estados:
//   running=false, over=false → preview "pronto" (slime parado com a cor/tamanho atuais)
//   running=true              → jogando (loop rAF)
//   over=true                 → game over (frame congelado + overlay)
function GameScene({ attrs, running, onGameOver }) {
  const radius = slimeRadius(attrs.size);

  const engineRef = useRef(null);
  if (engineRef.current === null) engineRef.current = new GameEngine(attrs);

  // Snapshot dos atributos congelados da run (para a aba "Categoria" no game over).
  // No game over, `running` zera e `attrs` volta aos valores ao vivo do editor.
  const runAttrsRef = useRef(attrs);

  const slimeWrapRef = useRef(null);
  const platRefs = useRef([]);
  const inputRef = useRef({ left: false, right: false });
  const rafRef = useRef(0);
  const poseRef = useRef('idle');
  const scoreRef = useRef(0);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  const [pose, setPose] = useState('idle');
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  const draw = useCallback(() => {
    const eng = engineRef.current;
    const s = eng.slime;

    if (slimeWrapRef.current) {
      slimeWrapRef.current.setAttribute(
        'transform',
        `translate(${s.x.toFixed(2)} ${eng.screenYOf(s.y).toFixed(2)})`
      );
    }

    const np = poseFromState({
      vy: s.vy,
      justBounced: eng.justBounced,
      blinking: eng.blinking,
    });
    if (np !== poseRef.current) {
      poseRef.current = np;
      setPose(np);
    }

    const ps = eng.platforms;
    for (let i = 0; i < POOL; i++) {
      const node = platRefs.current[i];
      if (!node) continue;
      const p = ps[i];
      if (!p) {
        node.style.display = 'none';
        continue;
      }
      node.style.display = '';
      node.setAttribute(
        'transform',
        `translate(${p.x.toFixed(2)} ${eng.screenYOf(p.y).toFixed(2)})`
      );
    }

    if (eng.score !== scoreRef.current) {
      scoreRef.current = eng.score;
      setScore(eng.score);
    }
  }, []);

  const loop = useCallback(() => {
    const eng = engineRef.current;
    eng.step(inputRef.current);
    draw();
    if (eng.over) {
      setOver(true);
      onGameOverRef.current?.();
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  // Posiciona tudo antes do primeiro paint (sem flash em 0,0).
  useLayoutEffect(() => {
    draw();
  }, [draw]);

  // Entrar em "jogando": reinicia o mundo e dispara o loop.
  useEffect(() => {
    if (!running) return;
    const eng = engineRef.current;
    runAttrsRef.current = attrs;
    eng.reset(attrs);
    inputRef.current = { left: false, right: false };
    setOver(false);
    scoreRef.current = 0;
    setScore(0);
    poseRef.current = 'fall';
    setPose('fall');
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // attrs é o snapshot do momento do Play; só (re)inicia ao alternar running.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Sincroniza o engine com os atributos ao vivo durante o jogo (color é reativo via
  // prop JSX; speed/jump/radius precisam ser injetados no engine diretamente).
  useEffect(() => {
    if (!running) return;
    const eng = engineRef.current;
    eng.speed = attrs.speed;
    eng.jumpV = attrs.jump;
    eng.radius = slimeRadius(attrs.size);
  }, [running, attrs.speed, attrs.jump, attrs.size]);

  // Preview "pronto": fora do jogo (e fora do game over), reflete os atributos ao vivo.
  useEffect(() => {
    if (running || over) return;
    const eng = engineRef.current;
    eng.reset(attrs);
    inputRef.current = { left: false, right: false };
    scoreRef.current = 0;
    setScore(0);
    draw();
  }, [running, over, attrs, draw]);

  // Teclado.
  useEffect(() => {
    const down = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (LEFT_KEYS.has(e.key)) inputRef.current.left = true;
      else if (RIGHT_KEYS.has(e.key)) inputRef.current.right = true;
      if (BLOCK_SCROLL.has(e.key)) e.preventDefault();
    };
    const up = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (LEFT_KEYS.has(e.key)) inputRef.current.left = false;
      else if (RIGHT_KEYS.has(e.key)) inputRef.current.right = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  const hold = (side, value) => () => {
    inputRef.current[side] = value;
  };

  return (
    <div className="relative w-full max-w-[360px]">
      <svg
        viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
        className="block w-full h-auto rounded-2xl border border-[#D9D9D9] shadow-sm"
        style={{ touchAction: 'none' }}
      >
        <defs>
          <linearGradient id="cj-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eaf6ff" />
            <stop offset="100%" stopColor="#f7f4fb" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={SCENE_WIDTH} height={SCENE_HEIGHT} fill="url(#cj-sky)" />

        {Array.from({ length: POOL }, (_, i) => (
          <rect
            key={i}
            ref={(el) => {
              platRefs.current[i] = el;
            }}
            width={PLATFORM_WIDTH}
            height={PLATFORM_HEIGHT}
            rx={PLATFORM_HEIGHT / 2}
            fill="#B8E3C0"
            stroke="rgba(60,110,75,0.35)"
            strokeWidth={1.5}
            style={{ display: 'none' }}
          />
        ))}

        {/* transform do slime é só imperativo (em draw) — sem prop JSX */}
        <g ref={slimeWrapRef}>
          <Slime color={attrs.color} radius={radius} pose={pose} />
        </g>
      </svg>

      {/* Placar */}
      <div className="absolute top-2 right-3 font-mono text-sm font-semibold text-[#333] bg-white/70 rounded-lg px-2 py-0.5">
        {score}
      </div>

      {/* Dica quando parado */}
      {!running && !over && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <span className="text-xs text-[#555] bg-white/75 rounded-full px-3 py-1">
            Aperte ▶ Play · mova com ← →
          </span>
        </div>
      )}

      {/* Controles de toque (mobile) */}
      <button
        type="button"
        aria-label="Esquerda"
        onPointerDown={hold('left', true)}
        onPointerUp={hold('left', false)}
        onPointerLeave={hold('left', false)}
        className="md:hidden absolute bottom-3 left-3 w-16 h-16 rounded-full bg-white/70 border border-[#D9D9D9] text-2xl text-[#333] active:bg-white"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Direita"
        onPointerDown={hold('right', true)}
        onPointerUp={hold('right', false)}
        onPointerLeave={hold('right', false)}
        className="md:hidden absolute bottom-3 right-3 w-16 h-16 rounded-full bg-white/70 border border-[#D9D9D9] text-2xl text-[#333] active:bg-white"
      >
        →
      </button>

      {/* Game over: modal full-screen com ranking compartilhado */}
      {over && (
        <GameOverModal
          score={score}
          attrs={runAttrsRef.current}
          onContinue={() => setOver(false)}
        />
      )}
    </div>
  );
}

export default GameScene;
