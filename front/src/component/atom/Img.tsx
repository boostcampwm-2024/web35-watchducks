type Props = {
  cssOption?: string;
  src: string;
  alt?: string;
};

export default function Img({ cssOption, src = '', alt }: Props) {
  return <img className={cssOption} src={src} alt={alt} />;
}
