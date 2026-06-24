// Conteúdo declarativo dos temas da Caça ao Tesouro.
//
// Convenção: o CÓDIGO é em inglês (ids dos temas: 'sports'/'school'/'computer'),
// mas o CONTEÚDO mostrado às crianças é em português (label, palavras, frases).
//
// Cada tema traz POOLS maiores do que o jogado em um circuito; cada partida
// sorteia um subconjunto (ver os mini-jogos), para o aluno que jogar muitas vezes
// nunca repetir o mesmo set:
//   words   — pool p/ caça-palavras: MAIÚSCULAS, sem acento (casa com a grade).
//             Palavras com mais de 10 letras são ignoradas na grade 10×10.
//   pairs   — 16 emojis distintos p/ o jogo da memória.
//   phrases — 3 frases p/ o desembaralhar (sorteia 1 por circuito).
export const THEMES = [
  {
    id: 'sports',
    label: 'Esporte',
    emoji: '⚽',
    words: [
      'BOLA', 'GOL', 'TIME', 'CHUTE', 'REDE', 'JOGO', 'CAMPO', 'FALTA',
      'PENALTI', 'CRAQUE', 'TORCIDA', 'MEDALHA', 'RAQUETE', 'CESTA',
      'CORRIDA', 'SALTO', 'TENIS', 'VOLEI', 'ARBITRO', 'GOLEIRO',
    ],
    pairs: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🥊', '🥋', '⛳', '🏆', '🥇'],
    phrases: [
      'O time marcou um gol',
      'A torcida comemorou a vitória',
      'O goleiro defendeu o pênalti',
    ],
  },
  {
    id: 'school',
    label: 'Escola',
    emoji: '✏️',
    words: [
      'LIVRO', 'LAPIS', 'PROVA', 'ALUNO', 'AULA', 'NOTA', 'MESA', 'GIZ',
      'QUADRO', 'CADERNO', 'BORRACHA', 'MOCHILA', 'REGUA', 'CANETA',
      'RECREIO', 'ESCOLA', 'ESTOJO', 'PASTA', 'TESOURA', 'PROFESSOR',
    ],
    pairs: ['📚', '📖', '✏️', '📝', '📐', '📏', '✂️', '🖍️', '🖊️', '🖌️', '📒', '📕', '🎒', '🧮', '🔖', '📎'],
    phrases: [
      'O aluno estudou para a prova',
      'A professora corrigiu os cadernos',
      'Eu guardei o livro na mochila',
    ],
  },
  {
    id: 'computer',
    label: 'Computador',
    emoji: '💻',
    words: [
      'MOUSE', 'TECLADO', 'MONITOR', 'TELA', 'CABO', 'REDE', 'PIXEL', 'BYTE',
      'ARQUIVO', 'PASTA', 'SENHA', 'MEMORIA', 'CHIP', 'CLIQUE', 'CODIGO',
      'INTERNET', 'PROGRAMA', 'NOTEBOOK', 'IMPRESSORA', 'PROCESSADOR',
    ],
    pairs: ['⌨️', '🖱️', '🖥️', '💻', '🖨️', '💾', '💿', '📀', '🔌', '🔋', '📷', '🎮', '📱', '☎️', '🕹️', '📡'],
    phrases: [
      'O processador deixa o jogo rápido',
      'O mouse abriu a pasta',
      'A senha protege o computador',
    ],
  },
];

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || null;
}

export default THEMES;
