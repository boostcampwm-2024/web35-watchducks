type Props = {
  cssOption?: string;
  content?: string;
  onClick?: () => void;
};

export default function P({ cssOption, content, onClick }: Props) {
  return (
    <p className={cssOption} onClick={onClick}>
      {content}
    </p>
  );
}
