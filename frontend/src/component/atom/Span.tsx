type Props = {
  cssOption?: string;
  content?: string;
  style?: React.CSSProperties;
};

export default function Span({ cssOption, content, style }: Props) {
  return (
    <span className={cssOption} style={style}>
      {content}
    </span>
  );
}
