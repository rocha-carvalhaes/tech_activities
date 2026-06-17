import { useState, useCallback } from 'react';
import ActivityShell from '../../components/ActivityShell.jsx';
import LevelPicker from './LevelPicker';
import PlayLevel from './PlayLevel';
import CreateLevel from './CreateLevel';

// Fábrica de Fases: o aluno entra e escolhe CRIAR uma fase nova ou SELECIONAR uma
// fase publicada pela turma para jogar (com cronômetro + ranking de tempo). A
// navegação entre as três telas (picker / play / create) é por estado simples; o
// botão "voltar" do shell recua uma tela (para o picker) ou sai da atividade.
function FabricaDeFases({ onBack }) {
  const [screen, setScreen] = useState('picker'); // 'picker' | 'play' | 'create'
  const [level, setLevel] = useState(null);

  const goToPicker = useCallback(() => {
    setLevel(null);
    setScreen('picker');
  }, []);

  const openPlay = useCallback((lvl) => {
    setLevel(lvl);
    setScreen('play');
  }, []);

  const openCreate = useCallback(() => setScreen('create'), []);

  const meta = {
    picker: {
      title: 'Fábrica de Fases',
      subtitle: 'Crie e compartilhe fases por código — ou jogue as da turma.',
    },
    create: {
      title: 'Fábrica de Fases · Nova fase',
      subtitle: 'Monte sua fase e vença para poder publicá-la.',
    },
    play: {
      title: level ? level.name : 'Fábrica de Fases',
      subtitle: level?.author ? `Fase por ${level.author}` : 'Jogue e marque seu tempo.',
    },
  }[screen];

  // No picker, voltar sai da atividade; nas demais telas, volta para o picker.
  const handleBack = screen === 'picker' ? onBack : goToPicker;

  return (
    <ActivityShell title={meta.title} subtitle={meta.subtitle} onBack={handleBack}>
      {screen === 'picker' && <LevelPicker onCreate={openCreate} onPlay={openPlay} />}
      {screen === 'play' && level && <PlayLevel level={level} onBackToList={goToPicker} />}
      {screen === 'create' && <CreateLevel onSaved={goToPicker} />}
    </ActivityShell>
  );
}

export default FabricaDeFases;
