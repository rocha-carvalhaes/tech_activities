// Espelha o BackButton da Dataduca para que as atividades tenham a mesma navegação.
function BackButton({ onClick, label = 'Voltar' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm font-medium text-[#6E6E6E] hover:text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#E6A8D7] rounded-lg px-2 py-1"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {label}
    </button>
  );
}

export default BackButton;
