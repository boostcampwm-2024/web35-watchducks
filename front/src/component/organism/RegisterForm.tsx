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
    <div className='flex flex-col items-center gap-[24px] rounded-[31px] border-2 border-white bg-white/25 px-[50px] py-[50px] shadow-[4px_9px_50px_-1px_rgba(0,0,0,0.25)] backdrop-blur-[30px]'>
      <H1 cssOption='text-blue font-bold text-[50px]' content='Register' />
      <H2 cssOption='text-gray text-[24px]' content='그룹 프로젝트를 등록해 주세요' />

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
        cssOption={`bg-blue rounded-[10px] text-white text-[25px] px-[130px] py-[15px] flex items-center justify-center whitespace-nowrap hover:text-black disabled:opacity-50 ${
          !isAllValid ? 'cursor-not-allowed' : ''
        }`}
        content={isLoading ? '등록 중...' : '등록하기'}
        onClick={handleSubmit}
        disabled={!isAllValid || isLoading}
      />
    </div>
  );
}
