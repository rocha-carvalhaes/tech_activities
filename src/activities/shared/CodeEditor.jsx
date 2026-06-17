import { useRef, useLayoutEffect } from 'react';

// Painel de código vertical (mesma altura da cena do jogo, à esquerda dela).
// Genérico: recebe o código, o resultado do parser ({ errors, warnings, ok }) e o
// estado do jogo. O botão Play/Stop fica no rodapé. Compartilhado entre atividades.
function PlayStopButton({ running, canPlay, onPlay, onStop }) {
  if (running) {
    return (
      <button
        type="button"
        onClick={onStop}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[#7a1f2f] bg-[#F2B8C6] hover:bg-[#eda9ba] shadow-sm transition-all"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
        Stop
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onPlay}
      disabled={!canPlay}
      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-[#1e3a24] bg-[#B8E3C0] hover:bg-[#a7d9b2] shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M8 5v14l11-7z" />
      </svg>
      Play
    </button>
  );
}

function CodeEditor({
  code,
  onCodeChange,
  parsed,
  running,
  onPlay,
  onStop,
  filename = 'personagem.code',
  // fitHeight: trava a altura do editor na do container (ex.: a cena do jogo) e
  // faz só a área de código rolar — barra de título e rodapé Play/Stop ficam fixos.
  // O pai precisa dar uma altura definida ao editor (ver Fábrica de Fases).
  fitHeight = false,
}) {
  const lineCount = code.split('\n').length;
  const textareaRef = useRef(null);

  // Em fitHeight, a textarea cresce até o conteúdo (sem scroll próprio) para que o
  // container role gutter + texto JUNTOS, mantendo os números de linha alinhados.
  useLayoutEffect(() => {
    if (!fitHeight) return;
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, [code, fitHeight]);

  return (
    <div
      className={`w-full max-w-[360px] flex flex-col rounded-2xl overflow-hidden border border-[#2a2a3a] shadow-sm bg-[#1e1e2e]${
        fitHeight ? ' md:absolute md:inset-0 md:h-full' : ''
      }`}
    >
      {/* barra de título */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#181825] border-b border-[#2a2a3a]">
        <span className="w-3 h-3 rounded-full bg-[#f38ba8]" />
        <span className="w-3 h-3 rounded-full bg-[#f9e2af]" />
        <span className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
        <span className="ml-2 text-xs text-[#9399b2] font-mono">{filename}</span>
      </div>

      {/* editor: em fitHeight é um container rolável; senão cresce naturalmente */}
      <div className={fitHeight ? 'flex-1 min-h-0 overflow-y-auto bg-[#1e1e2e]' : 'flex flex-1 min-h-0'}>
        <div className={fitHeight ? 'flex min-h-full' : 'contents'}>
          <div
            aria-hidden
            className="select-none py-3 px-3 text-right font-mono text-sm leading-6 text-[#585b70] bg-[#1a1a28]"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className={`flex-1 resize-none py-3 px-3 font-mono text-sm leading-6 text-[#cdd6f4] bg-[#1e1e2e] outline-none caret-[#cdd6f4]${
              fitHeight ? ' overflow-hidden' : ''
            }`}
          />
        </div>
      </div>

      {/* rodapé: erros/avisos + Play/Stop */}
      <div className="border-t border-[#2a2a3a] bg-[#181825] p-3 space-y-2">
        {parsed.errors.length > 0 && (
          <ul className="text-xs text-[#f38ba8] list-disc pl-4 space-y-0.5 max-h-24 overflow-auto" role="alert">
            {parsed.errors.map((e, i) => (
              <li key={i}>{e.message}</li>
            ))}
          </ul>
        )}
        {parsed.errors.length === 0 && parsed.warnings.length > 0 && (
          <ul className="text-xs text-[#f9e2af] list-disc pl-4 space-y-0.5 max-h-20 overflow-auto">
            {parsed.warnings.map((w, i) => (
              <li key={i}>{w.message}</li>
            ))}
          </ul>
        )}
        <PlayStopButton
          running={running}
          canPlay={parsed.ok}
          onPlay={onPlay}
          onStop={onStop}
        />
      </div>
    </div>
  );
}

export default CodeEditor;
