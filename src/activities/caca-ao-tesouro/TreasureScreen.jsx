import { useEffect, useRef, useState } from 'react';

// Tela do tesouro: o aluno digita os 3 números que coletou. Código certo → o
// cadeado abre e o baú revela o tesouro. Errado → o baú treme e ele tenta de novo
// (o relógio segue correndo). A dica está no tracker, no canto superior esquerdo.
function TreasureScreen({ code, onSolved }) {
  const [digits, setDigits] = useState(['', '', '']);
  const [status, setStatus] = useState('idle'); // 'idle' | 'wrong' | 'open'
  const inputsRef = useRef([]);
  const timerRef = useRef(0);

  const open = status === 'open';

  // Limpa o timer pendente só ao desmontar (validação imperativa abaixo agenda os
  // timeouts; deixar de fora do effect evita que um re-render os cancele).
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = (i, raw) => {
    if (status !== 'idle') return; // travado durante "errado"/"aberto"
    const val = raw.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 2) inputsRef.current[i + 1]?.focus();

    if (!next.every((d) => d !== '')) return;

    if (next.join('') === code.join('')) {
      setStatus('open');
      timerRef.current = setTimeout(() => onSolved(), 1500);
    } else {
      setStatus('wrong');
      timerRef.current = setTimeout(() => {
        setDigits(['', '', '']);
        setStatus('idle');
        inputsRef.current[0]?.focus();
      }, 800);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-xl font-bold text-[#333]">O baú do tesouro</h2>

      {/* Baú + cadeado */}
      <div className={status === 'wrong' ? 'ct-shake' : ''}>
        <svg viewBox="0 0 200 190" className="w-56 h-56" aria-hidden>
          {/* brilho/tesouro atrás da tampa (aparece ao abrir) */}
          {open && (
            <g>
              <circle cx="100" cy="92" r="34" fill="#fde68a" opacity="0.9" />
              <path
                d="M100 66 l7 16 17 2 -13 12 4 17 -15 -9 -15 9 4 -17 -13 -12 17 -2 z"
                fill="#f6c945"
                stroke="#d9a520"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* tampa (gira ao abrir, dobradiça no fundo y=92) */}
          <g
            style={{
              transformOrigin: '100px 92px',
              transition: 'transform 600ms cubic-bezier(.34,1.3,.5,1)',
              transform: open ? 'rotate(-58deg)' : 'rotate(0deg)',
            }}
          >
            <path
              d="M44 92 V70 a56 40 0 0 1 112 0 V92 Z"
              fill="#c98a4b"
              stroke="#8a5a2b"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <rect x="92" y="70" width="16" height="22" rx="2" fill="#e9b765" stroke="#8a5a2b" strokeWidth="3" />
          </g>

          {/* corpo do baú */}
          <rect x="42" y="92" width="116" height="74" rx="8" fill="#c98a4b" stroke="#8a5a2b" strokeWidth="4" />
          <rect x="42" y="112" width="116" height="12" fill="#e9b765" stroke="#8a5a2b" strokeWidth="2" />

          {/* cadeado */}
          <g
            style={{
              transformOrigin: '100px 132px',
              transition: 'transform 500ms ease, opacity 500ms ease',
              transform: open ? 'translateY(-26px) rotate(16deg)' : 'none',
              opacity: open ? 0 : 1,
            }}
          >
            {/* arco */}
            <path
              d="M90 130 v-8 a10 10 0 0 1 20 0 v8"
              fill="none"
              stroke="#6b7280"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* corpo */}
            <rect x="86" y="128" width="28" height="22" rx="4" fill="#9ca3af" stroke="#6b7280" strokeWidth="2" />
            <circle cx="100" cy="138" r="3" fill="#4b5563" />
          </g>
        </svg>
      </div>

      {/* Entrada do código */}
      {open ? (
        <p className="text-lg font-bold text-[#1e3a24]">Tesouro encontrado! 🎉</p>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-3">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                inputMode="numeric"
                maxLength={1}
                autoFocus={i === 0}
                className="w-14 h-16 text-center text-3xl font-mono font-bold rounded-xl border-2 border-[#D9D9D9] text-[#333] focus:outline-none focus:border-[#E6A8D7]"
              />
            ))}
          </div>
          <p className={`text-sm h-5 ${status === 'wrong' ? 'text-[#c2415a] font-semibold' : 'text-[#777]'}`}>
            {status === 'wrong'
              ? 'Código errado! Confira os números no canto.'
              : 'Digite o código que você coletou nas estações.'}
          </p>
        </div>
      )}
    </div>
  );
}

export default TreasureScreen;
