type Props = {
  cssOption?: string;
  content: string;
};

export default function Span({ cssOption, content = '' }: Props) {
  return <span className={cssOption}>{content}</span>;
}
