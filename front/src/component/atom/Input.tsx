import { forwardRef, ForwardedRef } from 'react';

type InputProps = {
  cssOption?: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default forwardRef<HTMLInputElement, InputProps>(function Input(
  { cssOption, type = '', value = '', placeholder, onChange }: InputProps,
  ref?: ForwardedRef<HTMLInputElement>
) {
  return (
    <input
      ref={ref}
      className={cssOption}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
});
