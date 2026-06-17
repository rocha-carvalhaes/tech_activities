import { useState, useEffect, useCallback } from 'react';
import { getTopTimes, submitTime, rankingEnabled, NAME_MAX } from './ranking';
import { formatTime } from './formatTime';

// Modal de vitória com ranking de TEMPO da fase (Firestore). Mesmo visual/fluxo
// do Personagem Saltador, mas uma única lista (os melhores tempos desta fase) e
// menor tempo = melhor. Registro inline do tempo da run atual.
function TimeRankingModal({ levelId, levelName, timeMs, modified = false, onPlayAgain, onBackToList }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Registro inline.
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);

  const load = useCallback(async () => {
    if (!rankingEnabled) {
      setLoading(false);
      setError(true);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      setRows(await getTopTimes(levelId, 5));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [levelId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!name.trim() || submitting) return;
      setSubmitting(true);
      try {
        const id = await submitTime({ levelId, name, timeMs });
        setSubmittedId(id);
        setShowForm(false);
        await load();
      } catch {
        setError(true);
      } finally {
        setSubmitting(false);
      }
    },
    [name, submitting, levelId, timeMs, load]
  );

  const registered = submittedId !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-[380px] rounded-2xl bg-white shadow-xl p-6 flex flex-col items-center">
        <div className="text-4xl mb-1">⭐</div>
        <h2 className="text-2xl font-bold text-[#333333]">Você chegou!</h2>
        <p className="text-[#777777] mt-1 mb-4">
          Seu tempo: <strong className="text-[#333] font-mono">{formatTime(timeMs)}</strong>
        </p>

        {/* Ranking da fase */}
        <div className="w-full">
          <div className="px-1 pb-1">
            <span className="text-sm font-semibold text-[#555]">
              Melhores tempos {levelName ? `· ${levelName}` : ''}
            </span>
          </div>
          <div className="rounded-xl border border-[#D9D9D9] bg-[#F5F6F7] p-3 min-h-[164px]">
            {loading ? (
              <p className="text-sm text-[#777] text-center py-8">Carregando…</p>
            ) : error ? (
              <p className="text-sm text-[#777] text-center py-8">Ranking indisponível.</p>
            ) : rows.length === 0 ? (
              <p className="text-sm text-[#777] text-center py-8">Seja o primeiro a registrar!</p>
            ) : (
              <ol className="flex flex-col gap-1">
                {rows.map((row, i) => {
                  const mine = row.id === submittedId;
                  return (
                    <li
                      key={row.id}
                      className={`flex items-center gap-2 text-sm rounded-lg px-2 py-1 ${
                        mine ? 'bg-[#B8E3C0]' : ''
                      }`}
                    >
                      <span className="w-5 text-[#777] font-mono">{i + 1}</span>
                      <span className="flex-1 truncate text-[#333]">{row.name}</span>
                      <span className="font-mono font-semibold text-[#333]">
                        {formatTime(row.timeMs)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>

        {/* Registro inline */}
        <div className="w-full mt-4">
          {modified ? (
            <p className="text-center text-sm text-[#8a6d3b] bg-[#fcf3d9] border border-[#f0e0a8] rounded-xl px-3 py-2">
              Você modificou esta fase — o tempo não entra no ranking. Volte ao código
              original para registrar.
            </p>
          ) : registered ? (
            <p className="text-center text-sm font-semibold text-[#1e3a24]">Registrado! ✓</p>
          ) : showForm ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={NAME_MAX}
                placeholder="Seu nome"
                className="flex-1 min-w-0 rounded-xl border border-[#D9D9D9] px-3 py-2 text-sm text-[#333] focus:outline-none focus:border-[#B8E3C0]"
              />
              <button
                type="submit"
                disabled={!name.trim() || submitting}
                className="px-4 py-2 rounded-xl font-semibold text-[#1e3a24] bg-[#B8E3C0] hover:bg-[#a7d9b2] shadow-sm disabled:opacity-50"
              >
                {submitting ? '…' : 'Enviar'}
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              disabled={!rankingEnabled}
              className="w-full px-5 py-2 rounded-xl font-semibold text-[#1e3a24] bg-[#B8E3C0] hover:bg-[#a7d9b2] shadow-sm disabled:opacity-50"
            >
              Registrar meu tempo
            </button>
          )}
        </div>

        <div className="w-full mt-2 flex gap-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 px-5 py-2 rounded-xl font-semibold text-[#333] bg-[#F5F6F7] border border-[#D9D9D9] hover:bg-[#ebecee]"
          >
            Jogar de novo
          </button>
          <button
            type="button"
            onClick={onBackToList}
            className="flex-1 px-5 py-2 rounded-xl font-semibold text-[#333] bg-[#F5F6F7] border border-[#D9D9D9] hover:bg-[#ebecee]"
          >
            Voltar à lista
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimeRankingModal;
