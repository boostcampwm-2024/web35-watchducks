import Button from '@component/atom/Button';
import H1 from '@component/atom/H1';
import H2 from '@component/atom/H2';
import ValidateTextInput from '@component/molecule/ValidateTextInput';
import { useRef, useEffect } from 'react';

import useRegisterForm from '@/hook/useRegisterForm';
type Props = {
  showAlert: (message: string) => void;
};

export default function RegisterForm({ showAlert }: Props) {
  const { formData, validation, handleChange, handleSubmit, isLoading, isAllValid } =
    useRegisterForm({
      successCallback: (message) => showAlert(message),
      errorCallback: (message) => showAlert(message)
    });
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  return (
    <div className='md:rounded-31 md:p-50 mx-auto flex w-full max-w-[600px] flex-col items-center gap-16 rounded-lg border-2 border-white bg-white/25 p-6 shadow-[4px_9px_50px_-1px_rgba(0,0,0,0.25)] backdrop-blur-[30px] md:gap-24'>
      <H1 cssOption='text-blue font-bold text-24 md:text-50' content='Register' />
      <H2 cssOption='text-gray text-18 md:text-24' content='그룹 프로젝트를 등록해 주세요' />

      <ValidateTextInput
        ref={nameInputRef}
        type='text'
        value={formData.name}
        onChange={handleChange('name')}
        placeholder='프로젝트명 (ex. WatchDucks)'
        isValid={validation.isValidName}
      />

      <ValidateTextInput
        type='text'
        value={formData.domain}
        onChange={handleChange('domain')}
        placeholder='도메인 (ex. www.WatchDucks.site)'
        isValid={validation.isValidDomain}
      />

      <ValidateTextInput
        type='text'
        value={formData.ip}
        onChange={handleChange('ip')}
        placeholder='아이피 (ex. 192.0.0.1:3000)'
        isValid={validation.isValidIp}
      />

      <ValidateTextInput
        type='email'
        value={formData.email}
        onChange={handleChange('email')}
        placeholder='이메일 (ex. abcd1234@naver.com)'
        isValid={validation.isValidEmail}
      />

      <Button
        cssOption={`bg-blue rounded-10 text-white
                   text-16 md:text-24
                   px-16 md:px-130
                   py-8 md:py-15
                   flex items-center justify-center whitespace-nowrap
                   hover:text-black
                   disabled:opacity-50
                   w-full md:w-auto
                   ${!isAllValid ? 'cursor-not-allowed' : ''}`}
        content={isLoading ? '등록 중...' : '등록하기'}
        onClick={handleSubmit}
        disabled={!isAllValid || isLoading}
      />
    </div>
  );
}
