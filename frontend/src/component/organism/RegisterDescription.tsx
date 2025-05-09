import NavigateButton from '@component/molecule/NavigateButton';
import RegisterText from '@component/molecule/RegisterText';

export default function RegisterDescription() {
  return (
    <div className='flex h-screen flex-col shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] dark:text-white'>
      <div className='flex-1 overflow-y-auto p-[40px]'>
        <RegisterText />
      </div>
      <NavigateButton
        path='/'
        content='메인으로'
        cssOption='bg-blue w-[80%] rounded-[10px] text-white text-[25px] py-[10px] flex items-center justify-center whitespace-nowrap hover:text-black mx-[40px] my-[20px]'
      />
    </div>
  );
}
