import { useState, useEffect, useCallback } from 'react';
import { listLevels, levelsEnabled, incrementPlayCount } from './levelsStore';
import LevelPreview from './LevelPreview';

// Tela de entrada da Fábrica de Fases: de cara o aluno escolhe CRIAR uma fase
// nova ou SELECIONAR uma fase já publicada pela turma para jogar.
function LevelPicker({ onCreate, onPlay }) {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!levelsEnabled) {
      setLoading(false);
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      setLevels(await listLevels());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex flex-col gap-6">
      {/* Criar nova */}
      <button
        type="button"
        onClick={onCreate}
        className="w-full text-left rounded-2xl border-2 border-dashed border-[#B8E3C0] bg-[#f3fbf5] p-5 hover:bg-[#eaf7ee] hover:-translate-y-0.5 transition-all shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">🛠️</div>
          <div>
            <h2 className="text-lg font-semibold text-[#1e3a24]">Criar uma nova fase</h2>
            <p className="mt-0.5 text-sm text-[#557a5e]">
              Monte sua fase por código, vença para validar e publique para a turma.
            </p>
          </div>
        </div>
      </button>

      {/* Fases da turma */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#333333]">Fases da turma</h2>
          {!loading && (
            <button
              type="button"
              onClick={load}
              className="text-sm text-[#557a5e] hover:text-[#1e3a24] font-medium"
            >
              ↻ Atualizar
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-sm text-[#777] py-8 text-center">Carregando fases…</p>
        ) : error ? (
          <p className="text-sm text-[#777] py-8 text-center">
            Não foi possível carregar as fases (compartilhamento indisponível).
          </p>
        ) : levels.length === 0 ? (
          <p className="text-sm text-[#777] py-8 text-center">
            Nenhuma fase publicada ainda. Seja o primeiro a criar uma!
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => { incrementPlayCount(lvl.id); onPlay(lvl); }}
                className="text-left rounded-2xl border border-[#D9D9D9] bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <LevelPreview code={lvl.code} />
                <h3 className="font-semibold text-[#333] truncate">{lvl.name}</h3>
                <p className="text-xs text-[#777] truncate">
                  {lvl.author ? `por ${lvl.author}` : 'autor anônimo'}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1e3a24]">
                    ▶ Jogar
                  </span>
                  <span className="text-xs text-[#999]">
                    {lvl.playCount} {lvl.playCount === 1 ? 'jogada' : 'jogadas'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LevelPicker;
