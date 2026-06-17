// Constantes e sistema de grade da Fábrica de Fases.
//
// Cópia adaptada do motor do Slime Aventureiro (slime-platformer). É mantida
// SEPARADA de propósito: as duas atividades evoluem de forma independente (o
// Slime Aventureiro está virando uma campanha de níveis pré-definidos; aqui o
// foco é o aluno criar/compartilhar fases). Manter cópias evita que mudanças em
// uma quebrem a outra.
//
// Grade FIXA: cada célula tem CELL px. Uma caixa ocupa 1 célula. O slime ocupa
// size×size células. Coordenadas de célula: (col, row), col cresce para a direita
// e row cresce para CIMA a partir do chão (row 0 = sobre o chão).

export const CELL = 40;
export const VIEW_W = 480; // 12 células visíveis
export const VIEW_H = 400; // 10 células
export const GROUND_THICKNESS = CELL;
export const FLOOR_TOP_Y = VIEW_H - GROUND_THICKNESS; // topo do chão (y=360)

// Física (por frame, ~60fps).
export const GRAVITY = 1.2;
export const MAX_FALL = 18;

export const START_COL = 0;
export const LEVEL_MARGIN_COLS = 2; // colunas extras à direita do ponto mais distante

// Atributos escalares do personagem. size em CÉLULAS.
export const ATTR_DEFS = [
  { key: 'size', type: 'int', default: 1, min: 1, max: 4 },
  { key: 'color', type: 'color', default: 'teal' },
  { key: 'jump', type: 'int', default: 13, min: 1, max: 30 },
  { key: 'speed', type: 'float', default: 4, min: 1, max: 12 },
];

// Fase inicial (simples) com que o aluno COMEÇA ao criar: personagem padrão, um
// degrau e a estrela logo adiante. A partir daqui ele adiciona/edita/remove.
export const STARTER_CODE = [
  'size = 1',
  'color = "teal"',
  'jump = 13',
  'speed = 4',
  '',
  '# Monte sua fase! Caixas: box = (coluna, linha)',
  'box = (3, 0)',
  '',
  '# A estrela é o objetivo:',
  'goal = (6, 0)',
].join('\n');

// Largura do mundo (px): até o ponto mais à direita + margem, mínimo a tela.
export function levelWorldWidth(values) {
  const rightmostCol = (values.boxes || []).reduce(
    (mx, b) => Math.max(mx, b.col + 1),
    Math.max(START_COL, values.goal.col + 1)
  );
  return Math.max(VIEW_W, (rightmostCol + LEVEL_MARGIN_COLS) * CELL);
}

// Raio do slime (desenho) a partir de size em células.
export function slimeRadius(size) {
  return (size * CELL) / 2;
}

// Helpers de grade → pixel (mundo).
export function cellLeft(col) {
  return col * CELL;
}
export function cellBottomY(row) {
  return FLOOR_TOP_Y - row * CELL;
}
export function cellTopY(row) {
  return FLOOR_TOP_Y - (row + 1) * CELL;
}

// Y-mundo mais alto da fase (menor y entre topos das caixas), com 2 células de margem.
export function levelWorldTopY(values) {
  const highestBoxTop = (values.boxes || []).reduce(
    (mn, b) => Math.min(mn, cellTopY(b.row)),
    0
  );
  return highestBoxTop - CELL * 2;
}
