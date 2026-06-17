import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import Slime from '../shared/Slime';
import { poseFromState } from '../shared/slimePoses';
import { PlatformerEngine } from './engine';
import {
  VIEW_W,
  VIEW_H,
  CELL,
  FLOOR_TOP_Y,
  GROUND_THICKNESS,
  slimeRadius,
  cellLeft,
  cellTopY,
  levelWorldWidth,
} from './constants';

const LEFT_KEYS = new Set(['ArrowLeft', 'a', 'A']);
const RIGHT_KEYS = new Set(['ArrowRight', 'd', 'D']);
const JUMP_KEYS = new Set(['ArrowUp', ' ', 'w', 'W']);
const BLOCK_SCROLL = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ']);

function starPath(cx, cy, outer, inner) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = ((-90 + i * 36) * Math.PI) / 180;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ',' + y.toFixed(2) + ' ';
  }
  return d + 'Z';
}

// Cena do plataformer. Estados parado/jogando/vitória, mesmo padrão do jogo 1.
// O slime e o mundo ficam dentro de um grupo transladado por -cameraX (a câmera).
function GameScene({ attrs, running, onWin, onPlayAgain, onNext, hasNext, onBackToLevels }) {
  const radius = slimeRadius(attrs.size);

  const engineRef = useRef(null);
  if (engineRef.current === null) engineRef.current = new PlatformerEngine(attrs);

  const worldRef = useRef(null);
  const slimeWrapRef = useRef(null);
  const inputRef = useRef({ left: false, right: false, up: false });
  const rafRef = useRef(0);
  const poseRef = useRef('idle');
  const onWinRef = useRef(onWin);
  onWinRef.current = onWin;

  const [pose, setPose] = useState('idle');
  const [won, setWon] = useState(false);

  const draw = useCallback(() => {
    const eng = engineRef.current;
    const s = eng.slime;
    if (worldRef.current) {
      worldRef.current.setAttribute(
        'transform',
        `translate(${(-eng.cameraX).toFixed(2)} ${(-eng.cameraY).toFixed(2)})`
      );
    }
    if (slimeWrapRef.current) {
      const cx = s.x + eng.side / 2;
      const cy = s.y + eng.side / 2;
      slimeWrapRef.current.setAttribute('transform', `translate(${cx.toFixed(2)} ${cy.toFixed(2)})`);
    }
    const np = poseFromState({ vy: s.vy, justBounced: eng.justBounced, blinking: eng.blinking });
    if (np !== poseRef.current) {
      poseRef.current = np;
      setPose(np);
    }
  }, []);

  const loop = useCallback(() => {
    const eng = engineRef.current;
    eng.step(inputRef.current);
    draw();
    if (eng.won) {
      setWon(true);
      onWinRef.current?.();
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  useLayoutEffect(() => {
    draw();
  }, [draw]);

  // Entrar em "jogando".
  useEffect(() => {
    if (!running) return;
    const eng = engineRef.current;
    eng.reset(attrs);
    inputRef.current = { left: false, right: false, up: false };
    setWon(false);
    poseRef.current = 'idle';
    setPose('idle');
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // Sincroniza o engine com os atributos ao vivo durante o jogo.
  // color é reativo via prop JSX; os demais precisam ser injetados diretamente.
  useEffect(() => {
    if (!running) return;
    const eng = engineRef.current;
    eng.speed = attrs.speed;
    eng.jumpImpulse = attrs.jump;
    eng.side = attrs.size * CELL;
    const mkBox = (col, row) => ({
      left: cellLeft(col), top: cellTopY(row),
      right: cellLeft(col) + CELL, bottom: cellTopY(row) + CELL,
    });
    eng.boxes = (attrs.boxes || []).map((b) => mkBox(b.col, b.row));
    eng.goalBox = mkBox(attrs.goal.col, attrs.goal.row);
    eng.worldWidth = levelWorldWidth(attrs);
  }, [running, attrs.speed, attrs.jump, attrs.size, attrs.boxes, attrs.goal]);

  // Preview ao vivo quando parado (reflete size/color/caixas/goal).
  useEffect(() => {
    if (running || won) return;
    const eng = engineRef.current;
    eng.reset(attrs);
    inputRef.current = { left: false, right: false, up: false };
    draw();
  }, [running, won, attrs, draw]);

  // Teclado.
  useEffect(() => {
    const down = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (LEFT_KEYS.has(e.key)) inputRef.current.left = true;
      else if (RIGHT_KEYS.has(e.key)) inputRef.current.right = true;
      if (JUMP_KEYS.has(e.key)) inputRef.current.up = true;
      if (BLOCK_SCROLL.has(e.key)) e.preventDefault();
    };
    const up = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (LEFT_KEYS.has(e.key)) inputRef.current.left = false;
      else if (RIGHT_KEYS.has(e.key)) inputRef.current.right = false;
      if (JUMP_KEYS.has(e.key)) inputRef.current.up = false;
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

  // Dados declarativos da fase (em coords do mundo).
  const worldWidth = levelWorldWidth(attrs);
  const boxes = attrs.boxes.map((b) => ({ x: cellLeft(b.col), y: cellTopY(b.row) }));
  const goalCx = cellLeft(attrs.goal.col) + CELL / 2;
  const goalCy = cellTopY(attrs.goal.row) + CELL / 2;

  return (
    <div className="relative w-full max-w-[480px]">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="block w-full h-auto rounded-2xl border border-[#D9D9D9] shadow-sm"
        style={{ touchAction: 'none' }}
      >
        <defs>
          <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dff1ff" />
            <stop offset="100%" stopColor="#f3f8ff" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#sp-sky)" />

        <g ref={worldRef}>
          {/* chão */}
          <rect x="0" y={FLOOR_TOP_Y} width={worldWidth} height={GROUND_THICKNESS} fill="#caa472" />
          <rect x="0" y={FLOOR_TOP_Y} width={worldWidth} height="6" fill="#9bcf6b" />

          {/* caixas */}
          {boxes.map((bx, i) => (
            <g key={i}>
              <rect x={bx.x} y={bx.y} width={CELL} height={CELL} rx="5" fill="#c98a4b" stroke="#8a5a2b" strokeWidth="2" />
              <line x1={bx.x + 4} y1={bx.y + CELL / 2} x2={bx.x + CELL - 4} y2={bx.y + CELL / 2} stroke="#8a5a2b" strokeWidth="1.5" />
              <line x1={bx.x + CELL / 2} y1={bx.y + 4} x2={bx.x + CELL / 2} y2={bx.y + CELL - 4} stroke="#8a5a2b" strokeWidth="1.5" />
            </g>
          ))}

          {/* objetivo: estrela */}
          <path
            d={starPath(goalCx, goalCy, CELL * 0.42, CELL * 0.18)}
            fill="#f6c945"
            stroke="#d9a520"
            strokeWidth="2"
            strokeLinejoin="round"
            className="animate-pulse"
          />

          {/* slime (transform imperativo em draw) */}
          <g ref={slimeWrapRef}>
            <Slime color={attrs.color} radius={radius} pose={pose} />
          </g>
        </g>
      </svg>

      {/* Dica quando parado */}
      {!running && !won && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          <span className="text-xs text-[#555] bg-white/80 rounded-full px-3 py-1">
            ▶ Play · mova com ← → · pule com ↑ ou espaço
          </span>
        </div>
      )}

      {/* Controles de toque */}
      <button
        type="button"
        aria-label="Esquerda"
        onPointerDown={hold('left', true)}
        onPointerUp={hold('left', false)}
        onPointerLeave={hold('left', false)}
        className="md:hidden absolute bottom-3 left-3 w-14 h-14 rounded-full bg-white/70 border border-[#D9D9D9] text-2xl text-[#333] active:bg-white"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Direita"
        onPointerDown={hold('right', true)}
        onPointerUp={hold('right', false)}
        onPointerLeave={hold('right', false)}
        className="md:hidden absolute bottom-3 left-20 w-14 h-14 rounded-full bg-white/70 border border-[#D9D9D9] text-2xl text-[#333] active:bg-white"
      >
        →
      </button>
      <button
        type="button"
        aria-label="Pular"
        onPointerDown={hold('up', true)}
        onPointerUp={hold('up', false)}
        onPointerLeave={hold('up', false)}
        className="md:hidden absolute bottom-3 right-3 w-16 h-16 rounded-full bg-[#B8E3C0]/90 border border-[#9bbf9f] text-base font-semibold text-[#1e3a24] active:bg-[#B8E3C0]"
      >
        Pular
      </button>

      {/* Vitória */}
      {won && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm rounded-2xl">
          <div className="text-5xl mb-2">⭐</div>
          <h2 className="text-2xl font-bold text-[#333333] mb-1">Você chegou!</h2>
          <p className="text-[#777777] mb-5">
            {hasNext ? 'Fase desbloqueada!' : 'Você terminou todas as fases! 🎉'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {hasNext && onNext && (
              <button
                type="button"
                onClick={onNext}
                className="px-5 py-2 rounded-xl font-semibold text-[#1e3a24] bg-[#B8E3C0] hover:bg-[#a7d9b2] shadow-sm"
              >
                Próximo nível →
              </button>
            )}
            <button
              type="button"
              onClick={onPlayAgain}
              className="px-5 py-2 rounded-xl font-semibold text-[#333333] bg-white border border-[#D9D9D9] hover:bg-[#f1faf3] shadow-sm"
            >
              Jogar de novo
            </button>
            {onBackToLevels && (
              <button
                type="button"
                onClick={onBackToLevels}
                className="px-5 py-2 rounded-xl font-semibold text-[#333333] bg-white border border-[#D9D9D9] hover:bg-[#f1faf3] shadow-sm"
              >
                Voltar às fases
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameScene;
