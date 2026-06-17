import { useState } from 'react';
import { activities, getActivity } from './activities/registry';
import { Card } from './components/ui';

function Home({ onOpen }) {
  return (
    <div className="min-h-screen">
      <header
        className="px-6 py-10 text-white"
        style={{ background: 'linear-gradient(90deg, #B8E3C0, #E6A8D7)' }}
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-medium opacity-90">Dataduca</p>
          <h1 className="text-3xl font-bold">Atividades adhoc</h1>
          <p className="mt-1 max-w-2xl text-white/90">
            Protótipos rápidos de atividades para testar com os alunos. Escolha
            uma para começar.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {activities.length === 0 ? (
          <p className="text-[#777777]">
            Nenhuma atividade registrada ainda. Adicione uma em{' '}
            <code>src/activities/registry.js</code>.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((a) => (
              <Card key={a.id} as="button" onClick={() => onOpen(a.id)}>
                {a.cover ? (
                  <img
                    src={import.meta.env.BASE_URL + a.cover}
                    alt={a.title}
                    className="w-full h-36 object-cover rounded-xl mb-3"
                  />
                ) : (
                  <div className="text-3xl mb-3">{a.emoji}</div>
                )}
                <h2 className="text-lg font-semibold text-[#333333]">
                  {a.title}
                </h2>
                <p className="mt-1 text-sm text-[#777777]">{a.subtitle}</p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  const [activeId, setActiveId] = useState(null);

  const active = activeId ? getActivity(activeId) : null;

  if (active) {
    const ActivityComponent = active.component;
    return <ActivityComponent onBack={() => setActiveId(null)} />;
  }

  return <Home onOpen={setActiveId} />;
}

export default App;
