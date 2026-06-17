// Constantes do jogo e definição dos atributos editáveis pelo aluno.
// Tudo em coordenadas da "cena" (viewBox do SVG). A câmera rola verticalmente.

// Dimensões da cena (viewBox do SVG do jogo).
export const SCENE_WIDTH = 360;
export const SCENE_HEIGHT = 540;

// Física (por frame, ~60fps), inspirada em flappy-game-core.js.
export const GRAVITY = 0.45;
export const MAX_FALL_SPEED = 14;
// Fração da altura onde o slime fica "preso" enquanto a câmera sobe.
export const CAMERA_ANCHOR = 0.5;

// Plataformas.
export const PLATFORM_WIDTH = 68;
export const PLATFORM_HEIGHT = 14;
export const PLATFORM_GAP = 90; // distância vertical média entre plataformas
export const PLATFORM_GAP_JITTER = 28;

// Slime: raio base (em size = 1) e quanto cada ponto de `size` acrescenta.
export const SLIME_BASE_RADIUS = 12;
export const SLIME_RADIUS_PER_SIZE = 5;

// Definição dos 4 atributos editáveis: tipo, default e faixa válida (clamp).
// `type`: 'int' | 'float' | 'color'. A ordem é a ordem mostrada no editor.
export const ATTR_DEFS = [
  { key: 'size', type: 'int', default: 3, min: 1, max: 6 },
  { key: 'color', type: 'color', default: 'teal' },
  { key: 'jump', type: 'int', default: 8, min: 1, max: 30 },
  { key: 'speed', type: 'float', default: 3.0, min: 1, max: 16 },
];

// Texto inicial do editor de código.
export const DEFAULT_CODE = [
  'size = 3',
  'color = "teal"',
  'jump = 10',
  'speed = 3.0',
].join('\n');

// Raio do slime a partir do atributo `size`.
export function slimeRadius(size) {
  return SLIME_BASE_RADIUS + (size - 1) * SLIME_RADIUS_PER_SIZE;
}
