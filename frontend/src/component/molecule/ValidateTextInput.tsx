import Input from '@component/atom/Input';
import ValidIcon from '@component/atom/ValidIcon';
import { forwardRef, ForwardedRef } from 'react';

type Props = {
  type: string;
  value: string;
  isValid: boolean;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default forwardRef<HTMLInputElement, Props>(function ValidateTextInput(
  { type = '', value = '', isValid = false, placeholder, onChange }: Props,
  ref?: ForwardedRef<HTMLInputElement>
) {
  const validationStyle = isValid ? 'border-green' : 'border-red';

  return (
    <div className='relative w-full'>
      <Input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        cssOption={`w-full h-40 pl-16 pr-30 border-1.5 rounded-1.5 hover:border-blue ${validationStyle}`}
      />
      <div className='absolute right-10 top-1/2 -translate-y-1/2'>
        <ValidIcon type={isValid ? 'success' : 'fail'} />
      </div>
    </div>
  );
});
