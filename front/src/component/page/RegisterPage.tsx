import Alert from '@component/atom/Alert';
import RegisterForm from '@component/organism/RegisterForm';
import useAlert from '@hook/useAlert';

import RegisterDescription from '@/component/organism/RegisterDescription';

export default function RegisterPage() {
  const { isVisible, message, showAlert } = useAlert({ time: 2000 });

  return (
    <>
      <div className='mx-50 gap-50 relative my-auto flex h-full w-full flex-col items-center justify-center md:flex-row'>
        <RegisterForm showAlert={showAlert} />
        <RegisterDescription />
      </div>

      {isVisible && (
        <Alert
          content={message}
          isVisible={isVisible}
          cssOption='text-18 border-2 border-white shadow-[4px_9px_50px_-1px_rgba(0,0,0,0.25)] z-[50] rounded-31 p-40 backdrop-blur-[30px] bg-white'
        />
      )}
    </>
  );
}
