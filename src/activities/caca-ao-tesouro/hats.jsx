// Chapéus do slime (SVG). Cada um é desenhado com a ORIGEM (0,0) na coroa da
// cabeça — o Slime já translada o nó para o topo (0, -r). `r` é o raio do slime.
//
// Valores em inglês (código): 'cap' (boné), 'straw' (palha), 'santa' (gorro).

function Cap({ r }) {
  return (
    <g>
      {/* aba para a frente */}
      <ellipse cx={0.5 * r} cy={0.05 * r} rx={0.64 * r} ry={0.14 * r} fill="#1d4ed8" />
      {/* copa */}
      <path
        d={`M ${-0.7 * r},${0.06 * r} A ${0.7 * r} ${0.66 * r} 0 0 1 ${0.7 * r},${0.06 * r} Z`}
        fill="#2563eb"
        stroke="#1e40af"
        strokeWidth={Math.max(1, r * 0.04)}
        strokeLinejoin="round"
      />
      {/* botão no topo */}
      <circle cx="0" cy={-0.58 * r} r={0.09 * r} fill="#1e40af" />
    </g>
  );
}

function Straw({ r }) {
  return (
    <g>
      {/* aba larga */}
      <ellipse
        cx="0"
        cy={0.07 * r}
        rx={0.98 * r}
        ry={0.2 * r}
        fill="#e0b552"
        stroke="#b9863a"
        strokeWidth={Math.max(1, r * 0.04)}
      />
      {/* copa arredondada */}
      <path
        d={`M ${-0.5 * r},${0.07 * r} A ${0.5 * r} ${0.55 * r} 0 0 1 ${0.5 * r},${0.07 * r} Z`}
        fill="#eac56a"
        stroke="#b9863a"
        strokeWidth={Math.max(1, r * 0.04)}
        strokeLinejoin="round"
      />
      {/* faixa */}
      <ellipse cx="0" cy={0.0 * r} rx={0.5 * r} ry={0.1 * r} fill="#a9542b" />
    </g>
  );
}

function Santa({ r }) {
  return (
    <g>
      {/* gorro vermelho inclinado */}
      <path
        d={`M ${-0.52 * r},${0.05 * r} Q ${0.05 * r},${-0.35 * r} ${0.48 * r},${-0.82 * r} Q ${0.34 * r},${-0.1 * r} ${0.52 * r},${0.05 * r} Z`}
        fill="#dc2626"
        stroke="#b91c1c"
        strokeWidth={Math.max(1, r * 0.04)}
        strokeLinejoin="round"
      />
      {/* barra de pelo branca */}
      <ellipse cx="0" cy={0.06 * r} rx={0.58 * r} ry={0.15 * r} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={Math.max(1, r * 0.03)} />
      {/* pompom */}
      <circle cx={0.48 * r} cy={-0.82 * r} r={0.16 * r} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={Math.max(1, r * 0.03)} />
    </g>
  );
}

const HAT_COMPONENTS = { cap: Cap, straw: Straw, santa: Santa };

// Rótulos em português para a UI (ex.: legenda das opções).
export const HAT_LABELS = {
  '': 'Nenhum',
  cap: 'Boné',
  straw: 'Chapéu de palha',
  santa: 'Gorro do Papai Noel',
};

// Retorna o nó SVG do chapéu (ou null para "" / valor desconhecido).
export function renderHat(hat, r) {
  const Comp = HAT_COMPONENTS[hat];
  return Comp ? <Comp r={r} /> : null;
}
