function Card({ children, className = '', onClick, as = 'div' }) {
  const Tag = as;
  const interactive = typeof onClick === 'function';
  return (
    <Tag
      onClick={onClick}
      className={[
        'bg-white border border-[#D9D9D9] rounded-2xl p-5 shadow-sm',
        interactive
          ? 'cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 text-left w-full'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}

export default Card;
