type Props = {
  cssOption?: string;
  content: string;
};

export default function H1({ cssOption, content = '' }: Props) {
  return <h1 className={cssOption}>{content}</h1>;
}
