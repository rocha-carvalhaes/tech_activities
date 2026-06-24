import { Card } from '../../components/ui';
import { THEMES } from './themes';

// Tela inicial: cada aluno escolhe o TEMA do circuito. O tema vale para as 3
// estações e é a "categoria" do ranking.
function ThemePicker({ onPick }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🗺️</div>
        <h2 className="text-xl font-bold text-[#333]">Escolha um tema</h2>
        <p className="text-sm text-[#777] mt-1">
          Passe pelas 3 estações para coletar os números e abrir o baú do tesouro.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {THEMES.map((theme) => (
          <Card key={theme.id} as="button" onClick={() => onPick(theme.id)} className="text-center">
            <div className="text-5xl mb-3">{theme.emoji}</div>
            <h3 className="text-lg font-semibold text-[#333]">{theme.label}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ThemePicker;
