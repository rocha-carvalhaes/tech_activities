import { useMemo, useState } from 'react';
import CodeEditor from '../shared/CodeEditor';
import Slime from '../shared/Slime';
import { parseSlimeAttrs } from './parseSlimeAttrs';
import { renderHat } from './hats';

// Modal "ambiente de programação" do slime: edita size/color/hat por código, com
// preview ao vivo. Reusa o CodeEditor compartilhado. O botão Play aplica (quando o
// código está válido) e fecha; o X/fundo cancela sem aplicar.
function SlimeCodeModal({ initialCode, onApply, onClose }) {
  const [code, setCode] = useState(initialCode);
  const parsed = useMemo(() => parseSlimeAttrs(code), [code]);
  const { size, color, hat } = parsed.values;
  const radius = 12 + size * 5;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[660px] rounded-2xl bg-white shadow-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-[#333]">Vista o seu slime</h2>
            <p className="text-xs text-[#777]">Mude o código e aperte Play para aplicar.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-lg text-[#777] hover:bg-[#F5F6F7] text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <CodeEditor
            code={code}
            onCodeChange={setCode}
            parsed={parsed}
            running={false}
            onPlay={() => {
              if (parsed.ok) onApply(code);
            }}
            onStop={() => {}}
            filename="slime.code"
          />

          {/* preview ao vivo */}
          <div className="flex-1 min-w-[200px] rounded-2xl bg-[#F5F6F7] border border-[#D9D9D9] flex items-center justify-center p-4">
            <svg viewBox="-72 -104 144 176" className="w-44 h-52">
              <Slime
                color={color}
                radius={radius}
                pose="idle"
                hatNode={renderHat(hat, radius)}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlimeCodeModal;
