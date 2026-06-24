import { POSES } from './slimePoses';

// Slime vetorial, desenhado em torno de (0,0) com raio `radius` (em unidades da
// cena). Corpo tingido por `color`; olhos/contorno escuros fixos. A pose aplica
// squash & stretch ancorado na base (y = +radius), pra parecer que pousa no chão.
//
// Props: color, radius, pose ('idle'|'stretch'|'fall'|'squash'|'blink'),
//        x, y (translação do centro na cena).
//
// Props opcionais (aditivas; quando ausentes, o slime é idêntico ao de antes):
//   eyeTarget — vetor { dx, dy } normalizado em [-1,1] que desloca as pupilas em
//               direção a um alvo (ex.: o cursor do mouse). null = olhar centrado.
//   hatNode   — nó SVG (chapéu) renderizado ancorado no topo da cabeça (0, -r).
function Slime({
  color = 'teal',
  radius = 18,
  pose = 'idle',
  x = 0,
  y = 0,
  eyeTarget = null,
  hatNode = null,
}) {
  const r = radius;
  const p = POSES[pose] ?? POSES.idle;

  // Corpo: "gota" arredondada com base mais larga (coords unitárias × r).
  const u = (n) => (n * r).toFixed(2);
  const body =
    `M ${u(-1)},${u(0.4)} ` +
    `C ${u(-1)},${u(-0.55)} ${u(-0.55)},${u(-1)} 0,${u(-1)} ` +
    `C ${u(0.55)},${u(-1)} ${u(1)},${u(-0.55)} ${u(1)},${u(0.4)} ` +
    `C ${u(1)},${u(0.8)} ${u(0.8)},${u(0.95)} 0,${u(0.95)} ` +
    `C ${u(-0.8)},${u(0.95)} ${u(-1)},${u(0.8)} ${u(-1)},${u(0.4)} Z`;

  const eyeR = 0.15 * r;
  const eyeX = 0.34 * r;
  const eyeY = p.eyeY * r;
  const stroke = Math.max(1, r * 0.07);

  // Deslocamento das pupilas em direção ao alvo (cursor). Clampado a uma fração
  // do raio do olho para o olhar não "escapar" da esclera.
  const clamp1 = (n) => Math.max(-1, Math.min(1, n));
  const maxShift = eyeR * 0.5;
  const px = eyeTarget ? clamp1(eyeTarget.dx) * maxShift : 0;
  const py = eyeTarget ? clamp1(eyeTarget.dy) * maxShift : 0;

  // Pivot do squash/stretch na base do slime.
  const deform = `translate(0 ${u(1)}) scale(${p.sx} ${p.sy}) translate(0 ${-u(1)})`;

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* sombra de contato no chão */}
      <ellipse cx="0" cy={r * 1.02} rx={r * 0.85 * p.sx} ry={r * 0.16} fill="rgba(0,0,0,0.14)" />
      <g transform={deform}>
        {/* corpo */}
        <path d={body} fill={color} stroke="rgba(20,20,30,0.35)" strokeWidth={stroke} strokeLinejoin="round" />
        {/* sombreado inferior */}
        <ellipse cx="0" cy={r * 0.55} rx={r * 0.7} ry={r * 0.32} fill="rgba(0,0,0,0.10)" />
        {/* brilho */}
        <ellipse cx={-r * 0.4} cy={-r * 0.45} rx={r * 0.28} ry={r * 0.2} fill="rgba(255,255,255,0.45)" transform={`rotate(-25 ${-r * 0.4} ${-r * 0.45})`} />

        {/* olhos */}
        {p.blink ? (
          <>
            <path d={`M ${-eyeX - eyeR},${eyeY} q ${eyeR},${eyeR * 0.9} ${eyeR * 2},0`} fill="none" stroke="#23232f" strokeWidth={eyeR * 0.5} strokeLinecap="round" />
            <path d={`M ${eyeX - eyeR},${eyeY} q ${eyeR},${eyeR * 0.9} ${eyeR * 2},0`} fill="none" stroke="#23232f" strokeWidth={eyeR * 0.5} strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={-eyeX + px} cy={eyeY + py} r={eyeR} fill="#23232f" />
            <circle cx={eyeX + px} cy={eyeY + py} r={eyeR} fill="#23232f" />
            {/* catchlights (acompanham a pupila) */}
            <circle cx={-eyeX + px + eyeR * 0.35} cy={eyeY + py - eyeR * 0.4} r={eyeR * 0.32} fill="rgba(255,255,255,0.9)" />
            <circle cx={eyeX + px + eyeR * 0.35} cy={eyeY + py - eyeR * 0.4} r={eyeR * 0.32} fill="rgba(255,255,255,0.9)" />
          </>
        )}

        {/* boca */}
        {p.mouth === 'o' ? (
          <ellipse cx="0" cy={eyeY + eyeR * 2.1} rx={eyeR * 0.55} ry={eyeR * 0.75} fill="rgba(20,20,30,0.55)" />
        ) : (
          <path d={`M ${-eyeR * 1.1},${eyeY + eyeR * 1.7} q ${eyeR * 1.1},${eyeR * 1.1} ${eyeR * 2.2},0`} fill="none" stroke="rgba(20,20,30,0.5)" strokeWidth={eyeR * 0.42} strokeLinecap="round" />
        )}

        {/* chapéu opcional, ancorado no topo da cabeça (0, -r) */}
        {hatNode && <g transform={`translate(0 ${u(-1)})`}>{hatNode}</g>}
      </g>
    </g>
  );
}

export default Slime;
