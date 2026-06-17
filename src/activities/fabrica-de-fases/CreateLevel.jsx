import { useState, useMemo, useCallback, useRef } from 'react';
import CodeEditor from '../shared/CodeEditor';
import GameScene from './GameScene';
import parseLevel from './parseLevel';
import { STARTER_CODE } from './constants';
import { createLevel, levelsEnabled, NAME_MAX, AUTHOR_MAX } from './levelsStore';

// Cria uma fase nova. Fluxo obrigatório antes de publicar:
//   cria → play → sucesso → publicar
//   cria → play → fracasso → edita → play → sucesso → publicar
// A publicação só é liberada quando o aluno VENCE a fase com o código atual.
// Mudar o código depois de vencer invalida a validação (precisa vencer de novo).
// Ao vencer, a opção de publicar aparece como POPUP no topo da tela do jogo.
function CreateLevel({ onSaved }) {
  const [code, setCode] = useState(STARTER_CODE);
  const [running, setRunning] = useState(false);
  const [runValues, setRunValues] = useState(null);
  // Código exato que foi vencido (validado). Publicar exige code === verifiedCode.
  const [verifiedCode, setVerifiedCode] = useState(null);
  const runCodeRef = useRef('');

  // Form de publicação (modal).
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const parsed = useMemo(() => parseLevel(code), [code]);
  const verified = parsed.ok && verifiedCode !== null && code === verifiedCode;

  const start = useCallback(() => {
    if (!parsed.ok) return;
    setRunValues(parsed.values);
    runCodeRef.current = code;
    setRunning(true);
  }, [parsed.ok, parsed.values, code]);

  const stop = useCallback(() => setRunning(false), []);

  const handleWin = useCallback(() => {
    setRunning(false);
    setVerifiedCode(runCodeRef.current); // valida exatamente o código jogado
  }, []);

  const handlePublish = useCallback(
    async (e) => {
      e.preventDefault();
      if (!name.trim() || saving || !verified) return;
      setSaving(true);
      setSaveError('');
      try {
        await createLevel({ name, author, code });
        onSaved?.();
      } catch (err) {
        setSaveError(err?.message || 'Não foi possível publicar.');
      } finally {
        setSaving(false);
      }
    },
    [name, author, code, saving, verified, onSaved]
  );

  const sceneValues = running && runValues ? runValues : parsed.values;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[#555555] max-w-3xl">
        Monte sua fase no código: ajuste o personagem (<code>size</code>, <code>color</code>,{' '}
        <code>jump</code>, <code>speed</code>), adicione/remova caixas com{' '}
        <code>box = (coluna, linha)</code> e mova a estrela com <code>goal = (coluna, linha)</code>.
        Aperte <strong>Play</strong> e <strong>vença a fase</strong> para liberar a publicação.
      </p>

      <div className="flex flex-col md:flex-row gap-4 items-stretch md:justify-center">
        {/* Wrapper relativo: no desktop o editor (md:absolute) preenche este
            wrapper, que por sua vez estica (items-stretch) até a altura da cena. */}
        <div className="relative w-full max-w-[360px]">
          <CodeEditor
            code={code}
            onCodeChange={setCode}
            parsed={parsed}
            running={running}
            onPlay={start}
            onStop={stop}
            filename="fase.code"
            fitHeight
          />
        </div>

        {/* Cena + popup de publicação ancorado no topo da tela do jogo */}
        <div className="relative w-full max-w-[480px]">
          <GameScene attrs={sceneValues} running={running} onWin={handleWin} />

          {verified && !showForm && (
            <div className="absolute top-2 inset-x-2 z-20 flex items-center gap-2 rounded-xl border border-[#B8E3C0] bg-white/95 shadow-lg px-3 py-2 ff-pop">
              <span className="text-sm font-semibold text-[#1e3a24]">✓ Fase vencida!</span>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="ml-auto px-3 py-1.5 rounded-lg text-sm font-semibold text-[#1e3a24] bg-[#B8E3C0] hover:bg-[#a7d9b2] shadow-sm"
              >
                Publicar fase
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dica enquanto a fase ainda não foi vencida (ou foi modificada após vencer) */}
      {!verified && (
        <p className="text-center text-sm text-[#777]">
          {verifiedCode !== null
            ? '✏️ Você mudou o código. Jogue e vença de novo para liberar a publicação.'
            : '🎯 Vença a fase (chegue na ⭐) para liberar a publicação.'}
        </p>
      )}

      {/* Modal do formulário de publicação */}
      {showForm && verified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <form
            onSubmit={handlePublish}
            className="w-full max-w-[380px] rounded-2xl bg-white shadow-xl p-6 flex flex-col gap-3"
          >
            <h2 className="text-lg font-bold text-[#333]">Publicar fase para a turma</h2>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={NAME_MAX}
              placeholder="Nome da fase"
              className="rounded-xl border border-[#D9D9D9] px-3 py-2 text-sm text-[#333] focus:outline-none focus:border-[#B8E3C0]"
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={AUTHOR_MAX}
              placeholder="Seu nome (autor)"
              className="rounded-xl border border-[#D9D9D9] px-3 py-2 text-sm text-[#333] focus:outline-none focus:border-[#B8E3C0]"
            />
            {saveError && <p className="text-xs text-[#b4434f]">{saveError}</p>}
            {!levelsEnabled && (
              <p className="text-xs text-[#777]">
                Publicação indisponível (Firebase não configurado).
              </p>
            )}
            <div className="flex gap-2 mt-1">
              <button
                type="submit"
                disabled={!name.trim() || saving || !levelsEnabled}
                className="flex-1 px-5 py-2 rounded-xl font-semibold text-[#1e3a24] bg-[#B8E3C0] hover:bg-[#a7d9b2] shadow-sm disabled:opacity-50"
              >
                {saving ? 'Publicando…' : 'Publicar'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-5 py-2 rounded-xl font-semibold text-[#333] bg-[#F5F6F7] border border-[#D9D9D9] hover:bg-[#ebecee]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateLevel;
