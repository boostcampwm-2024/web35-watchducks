type Props = {
  cssOption?: string;
  src: string;
};

export default function Img({ cssOption, src = '' }: Props) {
  return <img className={cssOption} src={src} />;
}
