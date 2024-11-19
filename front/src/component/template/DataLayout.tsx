type Props = {
  children: React.ReactNode;
  cssOption?: string;
};

export default function DataLayout({ children, cssOption }: Props) {
  return <div className={`${cssOption} bg-white hover:shadow-lg`}>{children}</div>;
}
