import { useState, useEffect, useCallback } from 'react';
import { formatTime } from '../shared/formatTime';
import {
  getTopGeneral,
  getTopCategory,
  submitTime,
  rankingEnabled,
  NAME_MAX,
} from './ranking';

// Modal final: tempo do circuito + mini-ranking (Geral / Tema) e registro inline
// do nome. Mesmo visual do GameOverModal do Personagem Saltador, mas por TEMPO.
function RankingModal({ themeId, themeLabel, themeEmoji, elapsedMs, onContinue }) {
  const [tab, setTab] = useState('geral');
  const [general, setGeneral] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      const [g, c] = await Promise.all([getTopGeneral(5), getTopCategory(themeId, 5)]);
      setGeneral(g);
      setCategory(c);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [themeId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!name.trim() || submitting) return;
      setSubmitting(true);
      try {
        const id = await submitTime({ name, timeMs: elapsedMs, themeId });
        setSubmittedId(id);
        setShowForm(false);
        await load();
      } catch {
        setError(true);
      } finally {
        setSubmitting(false);
      }
    },
    [name, submitting, elapsedMs, themeId, load]
  );

  const rows = tab === 'geral' ? general : category;
  const registered = submittedId !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-[380px] rounded-2xl bg-white shadow-xl p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-[#333333]">Tesouro encontrado! 🎉</h2>
        <p className="text-[#777777] mt-1 mb-4">
          Seu tempo: <strong className="text-[#333]">{formatTime(elapsedMs)}</strong>
        </p>

        <div className="w-full">
          <div className="flex gap-1 px-1">
            <Tab active={tab === 'geral'} onClick={() => setTab('geral')}>
              Geral
            </Tab>
            <Tab active={tab === 'tema'} onClick={() => setTab('tema')}>
              Tema
            </Tab>
          </div>

          <div className="rounded-xl rounded-tl-none border border-[#D9D9D9] bg-[#F5F6F7] p-3 min-h-[164px]">
            {tab === 'tema' && (
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="text-[10px] font-mono text-[#555] bg-white border border-[#D9D9D9] rounded-full px-2 py-0.5">
                  {themeEmoji} {themeLabel}
                </span>
              </div>
            )}

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

        <div className="w-full mt-4">
          {registered ? (
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
              Registrar no ranking
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full mt-2 px-5 py-2 rounded-xl font-semibold text-[#333] bg-[#F5F6F7] border border-[#D9D9D9] hover:bg-[#ebecee]"
        >
          Jogar de novo
        </button>
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 text-sm font-semibold rounded-t-lg border border-b-0 transition-colors ${
        active
          ? 'bg-[#F5F6F7] border-[#D9D9D9] text-[#333] -mb-px'
          : 'bg-transparent border-transparent text-[#999] hover:text-[#555]'
      }`}
    >
      {children}
    </button>
  );
}

export default RankingModal;
