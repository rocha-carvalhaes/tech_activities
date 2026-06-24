// Atributos editáveis do slime companion (modal de programação). Mesmo estilo do
// Personagem Saltador, mas só 3 atributos e com um tipo novo: `enum` (o chapéu).
//
// Valores de chapéu em INGLÊS (código): '' (nenhum) | 'cap' | 'straw' | 'santa'.

export const HAT_VALUES = ['', 'cap', 'straw', 'santa'];

// `type`: 'int' | 'color' | 'enum'. A ordem é a ordem mostrada no editor.
export const SLIME_ATTR_DEFS = [
  { key: 'size', type: 'int', default: 3, min: 1, max: 6 },
  { key: 'color', type: 'color', default: 'teal' },
  { key: 'hat', type: 'enum', default: '', options: HAT_VALUES },
];

// Código inicial do editor. O `hat` começa vazio, com as opções comentadas à
// direita para as crianças DESCOBRIREM (o parser ignora tudo após o `#`).
export const DEFAULT_SLIME_CODE = [
  'size = 3',
  'color = "teal"',
  'hat = ""   # "cap", "straw", "santa"',
].join('\n');

export const DEFAULT_SLIME = { size: 3, color: 'teal', hat: '' };
