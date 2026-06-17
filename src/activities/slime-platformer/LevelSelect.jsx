// Grade de seleção das 10 fases. Estado por fase a partir do progresso salvo:
// concluída (✓), jogável (atual/desbloqueada) ou bloqueada (🔒).
import { LEVELS } from './levels';

function LevelSelect({ progress, onPick }) {
  const { unlocked, completed } = progress;

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm text-[#555555] mb-4 text-center">
        Escolha uma fase. Conclua para desbloquear a próxima — a partir da fase 4,
        você vai precisar <strong>mexer no código</strong> para vencer!
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {LEVELS.map((level) => {
          const done = completed.includes(level.id);
          const locked = level.id > unlocked;

          return (
            <button
              key={level.id}
              type="button"
              disabled={locked}
              onClick={() => onPick(level)}
              title={locked ? 'Conclua a fase anterior para desbloquear' : level.name}
              className={
                'aspect-square rounded-2xl border flex flex-col items-center justify-center gap-1 p-2 text-center shadow-sm transition-all ' +
                (locked
                  ? 'border-[#E5E5E5] bg-[#F4F4F4] text-[#BBBBBB] cursor-not-allowed'
                  : done
                    ? 'border-[#9bbf9f] bg-[#B8E3C0] text-[#1e3a24] hover:bg-[#a7d9b2]'
                    : 'border-[#D9D9D9] bg-white text-[#333333] hover:border-[#9bbf9f] hover:bg-[#f1faf3]')
              }
            >
              <span className="text-2xl font-bold leading-none">
                {locked ? '🔒' : level.id}
              </span>
              <span className="text-[11px] leading-tight font-medium">
                {done ? '✓ ' : ''}
                {level.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LevelSelect;
