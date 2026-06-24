// Registro central das atividades adhoc.
//
// Para adicionar uma atividade:
//   1. Crie uma pasta em src/activities/<minha-atividade>/ com um index.jsx
//      que exporta por padrão um componente recebendo a prop { onBack }.
//   2. Importe-o aqui e adicione uma entrada no array `activities`.
//   3. A home (App.jsx) passa a listar e abrir a atividade automaticamente.
//
// Campos:
//   id        — slug único e estável (usado como chave/rota interna)
//   title     — nome exibido no card
//   subtitle  — uma linha curta de contexto
//   emoji     — ícone leve para o card (sem dependências de assets)
//   component — componente React da atividade
import CharacterJump from './character-jump/index.jsx';
import SlimePlatformer from './slime-platformer/index.jsx';
import FabricaDeFases from './fabrica-de-fases/index.jsx';
import CacaAoTesouro from './caca-ao-tesouro/index.jsx';

export const activities = [
  {
    id: 'character-jump',
    title: 'Personagem Saltador',
    subtitle:
      'Edite os atributos do personagem por código e jogue o salto entre plataformas.',
    emoji: '🦘',
    cover: 'covers/personagem-saltador.png',
    component: CharacterJump,
  },
  {
    id: 'slime-platformer',
    title: 'Slime Aventureiro',
    subtitle:
      'Edite o personagem e monte a fase com caixas por código; chegue até a estrela.',
    emoji: '🟢',
    cover: 'covers/slime-aventureiro.png',
    component: SlimePlatformer,
  },
  {
    id: 'fabrica-de-fases',
    title: 'Fábrica de Fases',
    subtitle:
      'Crie fases por código e compartilhe com a turma; jogue as dos colegas com ranking de tempo.',
    emoji: '🛠️',
    cover: 'covers/fabrica-fases.png',
    component: FabricaDeFases,
  },
  {
    id: 'caca-ao-tesouro',
    title: 'Caça ao Tesouro',
    subtitle:
      'Circuito de 3 desafios temáticos (caça-palavras, memória e desembaralhar): colete os números e abra o baú.',
    emoji: '🗺️',
    cover: 'covers/caca-ao-tesouro.svg',
    component: CacaAoTesouro,
  },
];

export function getActivity(id) {
  return activities.find((a) => a.id === id) || null;
}

export default activities;
