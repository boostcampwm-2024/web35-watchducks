type Props = {
  cssOption?: string;
  content: string;
};

export default function H2({ cssOption, content = '' }: Props) {
  return <h2 className={cssOption}>{content}</h2>;
}
