type ButtonProps = {
  cssOption?: string;
  content: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({ cssOption, content = '', onClick, disabled }: ButtonProps) {
  return (
    <button className={cssOption} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
