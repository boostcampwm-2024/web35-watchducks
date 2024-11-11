type Props = {
  cssOption?: string;
  content: string;
  isVisible?: boolean;
};

export default function Alert({ cssOption = '', content = '', isVisible = false }: Props) {
  const defaultStyle =
    'fixed left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap';

  return (
    <>
      <div
        className={`absolute inset-0 backdrop-blur-sm ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />

      <dialog
        open={isVisible}
        className={`${defaultStyle} ${cssOption} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {content}
      </dialog>
    </>
  );
}
