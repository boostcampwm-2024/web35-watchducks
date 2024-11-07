import NavigateButton from '@/component/molecule/NavigateButton';
import RegisterText from '@/component/molecule/RegisterText';

export default function RegisterDescription() {
  return (
    <div className='mr-[40px] flex h-screen flex-col shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'>
      <div className='flex-1 overflow-y-auto px-[40px] py-[50px]'>
        <RegisterText />
      </div>
      <NavigateButton path='/' />
    </div>
  );
}
