import Alert from '@component/atom/Alert';
import RegisterForm from '@component/organism/RegisterForm';
import useAlert from '@hook/useAlert';

import RegisterDescription from '@/component/organism/RegisterDescription';

export default function RegisterPage() {
  const { isVisible, message, showAlert } = useAlert({ time: 2000 });

  return (
    <>
      <div className='relative mx-[50px] my-auto flex h-screen w-full items-center justify-center gap-[50px]'>
        <RegisterForm showAlert={showAlert} />
        <RegisterDescription />
      </div>

      {isVisible && (
        <Alert
          content={message}
          isVisible={isVisible}
          cssOption='text-[18px] border-[2px] border-white shadow-[4px_9px_50px_-1px_rgba(0,0,0,0.25)] z-[1000] rounded-[31px] px-[40px] py-[40px] backdrop-blur-[30px] bg-white'
        />
      )}
    </>
  );
}
