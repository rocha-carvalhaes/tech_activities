import { BackButton } from './ui';

// Moldura comum a toda atividade: cabeçalho com voltar + título, e a área da atividade.
// Cada atividade só precisa renderizar o seu próprio conteúdo dentro do shell.
function ActivityShell({ title, subtitle, onBack, children }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[#D9D9D9] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <BackButton onClick={onBack} />
          <div>
            <h1 className="text-xl font-bold text-[#333333] leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[#777777]">{subtitle}</p>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

export default ActivityShell;
