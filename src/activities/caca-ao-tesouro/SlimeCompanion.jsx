import { useEffect, useRef, useState } from 'react';
import Slime from '../shared/Slime';
import { renderHat } from './hats';
import SlimeCodeModal from './SlimeCodeModal';

// Slime companion no canto inferior esquerdo, presente o circuito inteiro. Os
// OLHOS seguem o cursor do mouse; clicar abre o modal de programação (size/color/
// hat). É puramente cosmético — não afeta o circuito nem o ranking.
//
// Props: values ({ size, color, hat }), code (texto do editor) e onCodeChange.
function SlimeCompanion({ values, code, onCodeChange }) {
  const [eye, setEye] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const svgRef = useRef(null);
  const frameRef = useRef(0);

  // Olhos seguem o mouse: a cada movimento (com throttle por rAF), calcula a
  // direção do cursor relativa ao centro do slime e passa um vetor ao Slime.
  useEffect(() => {
    const onMove = (e) => {
      if (frameRef.current) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0;
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        setEye({ dx: (e.clientX - cx) / 100, dy: (e.clientY - cy) / 100 });
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const radius = 12 + values.size * 5;

  return (
    <div className="absolute bottom-4 left-4 z-30 flex flex-col items-center">
      <button
        type="button"
        onClick={() => setShowModal(true)}
        title="Clique para vestir o slime"
        className="rounded-2xl hover:bg-black/5 transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-[#E6A8D7]"
      >
        <svg ref={svgRef} viewBox="-72 -104 144 176" className="w-20 h-24 sm:w-24 sm:h-28">
          <Slime
            color={values.color}
            radius={radius}
            pose="idle"
            eyeTarget={eye}
            hatNode={renderHat(values.hat, radius)}
          />
        </svg>
      </button>
      <span className="text-[10px] text-[#999] -mt-1 select-none">clique em mim</span>

      {showModal && (
        <SlimeCodeModal
          initialCode={code}
          onApply={(newCode) => {
            onCodeChange(newCode);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default SlimeCompanion;
