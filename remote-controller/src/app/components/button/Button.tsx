type ButtonProps = {
  children: JSX.Element;
  onClick: () => void;
  ariaLabel: string;
};

export const Button = ({ children, onClick, ariaLabel }: ButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-full bg-cyan-800 w-12 h-12 lg:w-16 lg:h-16 max-h-lg flex items-center justify-center shadow-xl text-white cursor-pointer hover:ring hover:ring-cyan-700"
    aria-label={ariaLabel}
  >
    {children}
  </button>
);
