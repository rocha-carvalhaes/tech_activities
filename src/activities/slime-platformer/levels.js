// As 10 fases padrão do Slime Aventureiro.
//
// Cada fase é só um CÓDIGO INICIAL (sandbox totalmente editável). A "solução
// intencionada" é mexer nos atributos do personagem — não travamos as caixas.
// Física (ver engine.js/constants.js): chão contínuo (sem buracos); ápice de um
// pulo = jump² / 2.4 px (1 célula = 40px); pousar no topo de n caixas exige
// jump ≥ √(96·n)  →  n=1:10  n=2:14  n=3:17  n=4:20. jump padrão (13) sobe ~1.76
// célula. Fresta/teto de 1 célula (40px) só passa size = 1.

const lines = (...l) => l.join('\n');

// Helpers para montar caixas (o aluno vê o código já expandido em linhas box=()).
const box = (c, r) => `box = (${c}, ${r})`;
// Coluna de caixas de r0 até r1 (inclusive). Útil para muralhas/paredões altos.
const colRun = (c, r0, r1) =>
  Array.from({ length: r1 - r0 + 1 }, (_, i) => box(c, r0 + i));

export const LEVELS = [
  {
    id: 1,
    name: 'Linha reta',
    hint: 'Use → para andar até a estrela. Sem caixas, sem pulo!',
    code: lines(
      'size = 1',
      'color = "teal"',
      'jump = 13',
      'speed = 4',
      '',
      '# Sem caixas. Ande com → até a estrela!',
      'goal = (8, 0)'
    ),
  },
  {
    id: 2,
    name: 'Pulo simples',
    hint: 'Uma caixa no caminho. Pule com ↑ ou espaço.',
    code: lines(
      'size = 1',
      'color = "teal"',
      'jump = 13',
      'speed = 4',
      '',
      '# Uma caixa no caminho. Pule com ↑ ou espaço.',
      'box = (5, 0)',
      'goal = (9, 0)'
    ),
  },
  {
    id: 3,
    name: 'A escadinha',
    hint: 'Suba os degraus, um de cada vez, até a estrela.',
    code: lines(
      'size = 1',
      'color = "teal"',
      'jump = 13',
      'speed = 4',
      '',
      '# Degraus para subir.',
      'box = (4, 0)',
      'box = (8, 0)',
      'box = (8, 1)',
      'goal = (12, 0)'
    ),
  },
  {
    id: 4,
    name: 'Muro alto',
    hint: 'Um muro de 3 sem degraus. O pulo padrão não alcança — aumente o jump!',
    code: lines(
      'size = 1',
      'color = "teal"',
      'jump = 13',
      'speed = 4',
      '',
      '# Muro de 3 caixas, sem degraus. Aumente o jump para subir!',
      'box = (5, 0)',
      'box = (5, 1)',
      'box = (5, 2)',
      'goal = (9, 0)'
    ),
  },
  {
    id: 5,
    name: 'A muralha',
    hint: 'Um paredão te bloqueia, mas há uma fresta no chão. Diminua o size para passar por baixo!',
    code: lines(
      'size = 2',
      'color = "teal"',
      'jump = 13',
      'speed = 4',
      '',
      '# Passe por baixo da muralha. Diminua o size para caber na fresta!',
      'box = (4, 1)',
      'box = (4, 2)',
      'box = (4, 3)',
      'box = (4, 4)',
      'box = (4, 5)',
      'box = (4, 6)',
      'box = (4, 7)',
      'box = (4, 8)',
      'box = (4, 9)',
      'box = (4, 10)',
      'box = (5, 1)',
      'box = (5, 2)',
      'box = (5, 3)',
      'box = (5, 4)',
      'box = (5, 5)',
      'box = (5, 6)',
      'box = (5, 7)',
      'box = (5, 8)',
      'box = (5, 9)',
      'box = (5, 10)',
      'goal = (8, 0)'
    ),
  },
  {
    id: 6,
    name: 'Torre e fresta',
    hint: 'Suba a torre e desça pela fresta da coluna 5 — mas você é largo demais. Ajuste jump E size!',
    code: lines(
      'size = 2',
      'color = "teal"',
      'jump = 13',
      'speed = 4',
      '',
      '# Suba a torre e desça pela fresta (coluna 5). Ajuste jump E size!',
      'box = (4, 0)',
      'box = (4, 1)',
      'box = (4, 2)',
      'box = (6, 3)',
      'box = (6, 4)',
      'box = (6, 5)',
      'box = (6, 6)',
      'box = (6, 7)',
      'box = (6, 8)',
      'box = (6, 9)',
      'box = (6, 10)',
      'box = (6, 11)',
      'box = (6, 12)',
      'goal = (9, 0)'
    ),
  },
  {
    id: 7,
    name: 'A estrela presa',
    hint: 'A estrela está presa numa gaiola de caixas! Apague caixas para abrir caminho — e ajuste o pulo para alcançá-la.',
    code: lines(
      'size = 1',
      'color = "teal"',
      'jump = 13',
      'speed = 4',
      '',
      '# Parece que as caixas estão bloqueando a estrela...',
      'box = (8, 2)',
      'box = (8, 3)',
      'box = (8, 4)',
      'box = (9, 2)',
      'box = (9, 4)',
      'box = (10, 2)',
      'box = (10, 3)',
      'box = (10, 4)',
      'goal = (9, 3)'
    ),
  },
  {
    id: 8,
    name: 'Muralha e fresta',
    hint: 'Passe por baixo da muralha alta e depois pela fresta da torre. Aumentar só o pulo não basta — ajuste o size!',
    code: lines(
      'size = 3',
      'color = "teal"',
      'jump = 13',
      'speed = 4',
      '',
      '# Muralha alta (não dá pra escalar!): passe por baixo.',
      ...colRun(3, 1, 11),
      ...colRun(4, 1, 11),
      '# Torre + paredão pendurado: desça pela fresta da coluna 7.',
      ...colRun(6, 0, 2),
      ...colRun(8, 3, 12),
      'goal = (10, 0)'
    ),
  },
  {
    id: 9,
    name: 'A estrela amuralhada',
    hint: 'A estrela está numa gaiola atrás de uma muralha. Passe por baixo (size), apague uma caixa e salte até ela.',
    code: lines(
      'size = 3',
      'color = "teal"',
      'jump = 13',
      'speed = 4',
      '',
      '# Muralha alta: passe por baixo (diminua o size).',
      ...colRun(4, 1, 11),
      ...colRun(5, 1, 11),
      '# Gaiola da estrela: apague uma caixa para abrir caminho.',
      ...colRun(8, 2, 4),
      box(9, 2),
      box(9, 4),
      ...colRun(10, 2, 4),
      'goal = (9, 3)'
    ),
  },
  {
    id: 10,
    name: 'O grande desafio',
    hint: 'Fresta, muralha e estrela presa! Ajuste size e jump, apague uma caixa — e use o speed para a travessia.',
    code: lines(
      'size = 3',
      'color = "teal"',
      'jump = 13',
      'speed = 4',
      '',
      '# 1) Fresta: suba a torre e desça pela coluna 4.',
      ...colRun(3, 0, 2),
      ...colRun(5, 3, 12),
      '# 2) Muralha alta: passe por baixo.',
      ...colRun(7, 1, 11),
      ...colRun(8, 1, 11),
      '# 3) Estrela presa na gaiola: apague uma caixa.',
      ...colRun(11, 2, 4),
      box(12, 2),
      box(12, 4),
      ...colRun(13, 2, 4),
      'goal = (12, 3)'
    ),
  },
];

export default LEVELS;
