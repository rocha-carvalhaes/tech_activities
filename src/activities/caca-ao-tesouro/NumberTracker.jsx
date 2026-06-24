// Tracker fixo no canto superior esquerdo: acumula os números revelados a cada
// estação. Slots ainda não revelados mostram "?". É a "dica" do código do cadeado.
//
// Props: collected — array de 3 posições; cada uma é um dígito (revelado) ou null.
function NumberTracker({ collected }) {
  return (
    <div className="absolute top-3 left-3 z-30 bg-white/90 backdrop-blur rounded-xl border border-[#D9D9D9] shadow-sm px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#777] mb-1">
        Código do tesouro
      </p>
      <div className="flex gap-1.5">
        {collected.map((digit, i) => {
          const revealed = digit !== null && digit !== undefined;
          return (
            <div
              key={i}
              className={`w-8 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-lg border ${
                revealed
                  ? 'bg-[#B8E3C0] border-[#9bcf8f] text-[#1e3a24]'
                  : 'bg-[#F5F6F7] border-[#D9D9D9] text-[#bbb]'
              }`}
            >
              <span key={revealed ? `r${digit}` : 'q'} className={revealed ? 'ct-pop inline-block' : ''}>
                {revealed ? digit : '?'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NumberTracker;
