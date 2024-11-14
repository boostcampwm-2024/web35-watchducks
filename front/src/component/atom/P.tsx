type Props = {
  cssOption?: string;
  content: string;
};

export default function P({ cssOption, content = '' }: Props) {
  return <p className={cssOption}>{content}</p>;
}
