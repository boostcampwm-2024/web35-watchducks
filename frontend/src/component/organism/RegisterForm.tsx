import Button from '@component/atom/Button';
import H1 from '@component/atom/H1';
import H2 from '@component/atom/H2';
import Select from '@component/atom/Select';
import ValidateTextInput from '@component/molecule/ValidateTextInput';
import { GENERATION_OPTION } from '@constant/NavbarSelect';
import useRegisterForm from '@hook/useRegisterForm';
import { useRef, useEffect } from 'react';

type Props = {
  showAlert: (message: string) => void;
};

export default function RegisterForm({ showAlert }: Props) {
  const {
    formData,
    validation,
    handleChange,
    handleSelectChange,
    handleSubmit,
    isLoading,
    isAllValid
  } = useRegisterForm({
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
    <div className='mx-6 mx-auto flex w-full max-w-[600px] flex-col items-center gap-[16px] rounded-lg bg-white/25 p-6 shadow-[4px_9px_50px_-1px_rgba(0,0,0,0.25)] backdrop-blur-[30px] dark:shadow-[4px_9px_50px_-1px_rgba(255,255,255,0.1)] md:gap-[24px] md:rounded-[31px] md:p-[50px]'>
      <H1 cssOption='text-blue font-bold text-[24px] md:text-[50px]' content='Register' />
      <H2
        cssOption='text-gray text-[18px] md:text-[24px]'
        content='그룹 프로젝트를 등록해 주세요'
      />

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
        placeholder='도메인 (ex. www.watchDucks.site)'
        isValid={validation.isValidDomain}
      />

      <ValidateTextInput
        type='text'
        value={formData.ip}
        onChange={handleChange('ip')}
        placeholder='아이피 (ex. 192.0.0.1)'
        isValid={validation.isValidIp}
      />

      <ValidateTextInput
        type='email'
        value={formData.email}
        onChange={handleChange('email')}
        placeholder='이메일 (ex. abcd1234@naver.com)'
        isValid={validation.isValidEmail}
      />

      <Select
        cssOption='w-full py-2 px-4 rounded-[1.5px] border border-gray'
        options={GENERATION_OPTION}
        value={formData.generation}
        onChange={handleSelectChange('generation')}
      />

      <Button
        cssOption={`bg-blue rounded-[10px] text-white
                   text-16 md:text-[24px]
                   px-[16px] md:px-[130px]
                   py-[8px] md:py-[15px]
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
