type Props = {
  children: React.ReactNode;
  cssOption?: string;
};

export default function DataLayout({ children, cssOption }: Props) {
  return (
    <div className={`${cssOption} dark:bg-darkblue bg-white hover:shadow-lg dark:text-white`}>
      {children}
    </div>
  );
}
