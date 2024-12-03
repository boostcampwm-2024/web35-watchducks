type Props = {
  children: React.ReactNode;
  cssOption?: string;
};

export default function DataLayout({ children, cssOption }: Props) {
  return (
    <div
      className={`${cssOption} bg-white hover:shadow-lg dark:bg-darkblue dark:text-white dark:hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,1)]`}>
      {children}
    </div>
  );
}
