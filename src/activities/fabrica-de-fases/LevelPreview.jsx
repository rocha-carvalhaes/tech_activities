import { useMemo } from 'react';
import Slime from '../shared/Slime';
import parseLevel from './parseLevel';
import {
  CELL,
  VIEW_H,
  FLOOR_TOP_Y,
  GROUND_THICKNESS,
  START_COL,
  slimeRadius,
  cellLeft,
  cellTopY,
  levelWorldWidth,
} from './constants';

function starPath(cx, cy, outer, inner) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = ((-90 + i * 36) * Math.PI) / 180;
    d += (i === 0 ? 'M' : 'L') + (cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2) + ' ';
  }
  return d + 'Z';
}

// Miniatura ESTÁTICA da fase: mesmos elementos da cena (chão, caixas, estrela e
// o slime no ponto de partida), sem física/câmera. Enquadra a fase inteira num
// viewBox justo e preenche o card (slice, ancorado embaixo-à-esquerda) sobre um
// céu — fica como uma capa que mostra de relance o formato da fase.
function LevelPreview({ code }) {
  const { values } = useMemo(() => parseLevel(code), [code]);

  const worldWidth = levelWorldWidth(values);
  const side = values.size * CELL;
  const radius = slimeRadius(values.size);
  const slimeCx = cellLeft(START_COL) + side / 2;
  const slimeCy = FLOOR_TOP_Y - side / 2;

  // Topo do conteúdo (menor y entre caixas, estrela e slime) com 1 célula de céu.
  const tops = [FLOOR_TOP_Y - side, cellTopY(values.goal.row)];
  for (const b of values.boxes) tops.push(cellTopY(b.row));
  const vbTop = Math.min(...tops) - CELL;
  const vbHeight = VIEW_H - vbTop;

  return (
    <div
      className="w-full h-28 rounded-xl mb-3 overflow-hidden border border-[#e3e6ea]"
      style={{ background: 'linear-gradient(180deg, #dff1ff, #f3f8ff)' }}
    >
      <svg
        viewBox={`0 ${vbTop} ${worldWidth} ${vbHeight}`}
        preserveAspectRatio="xMinYMax slice"
        className="block w-full h-full"
      >
        {/* chão */}
        <rect x="0" y={FLOOR_TOP_Y} width={worldWidth} height={GROUND_THICKNESS} fill="#caa472" />
        <rect x="0" y={FLOOR_TOP_Y} width={worldWidth} height="6" fill="#9bcf6b" />

        {/* caixas */}
        {values.boxes.map((b, i) => {
          const x = cellLeft(b.col);
          const y = cellTopY(b.row);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={CELL}
              height={CELL}
              rx="5"
              fill="#c98a4b"
              stroke="#8a5a2b"
              strokeWidth="2"
            />
          );
        })}

        {/* objetivo: estrela */}
        <path
          d={starPath(cellLeft(values.goal.col) + CELL / 2, cellTopY(values.goal.row) + CELL / 2, CELL * 0.42, CELL * 0.18)}
          fill="#f6c945"
          stroke="#d9a520"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* slime no ponto de partida */}
        <Slime color={values.color} radius={radius} pose="idle" x={slimeCx} y={slimeCy} />
      </svg>
    </div>
  );
}

export default LevelPreview;
