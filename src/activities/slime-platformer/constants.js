// Constantes e sistema de grade do plataformer lateral.
//
// Grade FIXA: cada célula tem CELL px. Uma caixa ocupa 1 célula. O slime ocupa
// size×size células (lado = size*CELL), então um slime grande pode não caber em
// passagens estreitas. Coordenadas de célula: (col, row) com col crescendo para a
// direita e row crescendo para CIMA a partir do chão (row 0 = sobre o chão).

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

// Atributos escalares (iguais ao jogo 1, faixas próprias). size em CÉLULAS.
export const ATTR_DEFS = [
  { key: 'size', type: 'int', default: 1, min: 1, max: 4 },
  { key: 'color', type: 'color', default: 'teal' },
  { key: 'jump', type: 'int', default: 13, min: 1, max: 30 },
  { key: 'speed', type: 'float', default: 4, min: 1, max: 12 },
];

// Fase de exemplo: um degrau de 1, uma parede de 2 para subir, objetivo à direita.
export const DEFAULT_CODE = [
  'size = 1',
  'color = "teal"',
  'jump = 13',
  'speed = 4',
  '',
  '# caixas: box = (coluna, linha)',
  'box = (4, 0)',
  'box = (8, 0)',
  'box = (8, 1)',
  '',
  '# objetivo à direita',
  'goal = (12, 0)',
].join('\n');

// Largura do mundo (px): até o ponto mais à direita + margem, mínimo a tela.
// Usado pela engine (clamp/câmera) e pela cena (tamanho do chão). Fonte única.
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
// Usado pelo engine para clamp inferior de cameraY.
export function levelWorldTopY(values) {
  const highestBoxTop = (values.boxes || []).reduce(
    (mn, b) => Math.min(mn, cellTopY(b.row)),
    0
  );
  return highestBoxTop - CELL * 2;
}
