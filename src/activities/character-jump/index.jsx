import ActivityShell from '../../components/ActivityShell.jsx';

// Placeholder da primeira atividade.
//
// Próximo passo (já planejado): editor de atributos do personagem por linhas de
// código — size = int, color = string, jump = int, speed = float — e, ao clicar
// em "Play", um jogo de pular entre plataformas verticalmente usando esses
// atributos. Inspirado no flappy/doodle-jump de rocha-carvalhaes/personal_page.
function CharacterJump({ onBack }) {
  return (
    <ActivityShell
      title="Personagem Saltador"
      subtitle="Edite o personagem por código e jogue."
      onBack={onBack}
    >
      <div className="bg-white border border-dashed border-[#D9D9D9] rounded-2xl p-10 text-center">
        <p className="text-4xl mb-3">🦘</p>
        <h2 className="text-lg font-semibold text-[#333333] mb-2">
          Atividade em construção
        </h2>
        <p className="text-sm text-[#777777] max-w-md mx-auto">
          O ambiente está pronto. A próxima etapa é montar o editor de atributos
          (<code>size</code>, <code>color</code>, <code>jump</code>,{' '}
          <code>speed</code>) e o mini-jogo de salto entre plataformas.
        </p>
      </div>
    </ActivityShell>
  );
}

export default CharacterJump;
