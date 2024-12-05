import { Info } from 'lucide-react';
import { useState } from 'react';

type Props = {
  text: string;
};

export default function InformationButton({ text }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className='relative inline-flex items-center'
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}>
      <button
        className='bg-gray-100 hover:bg-gray-200 flex h-8 w-8 items-center justify-center rounded-full transition-colors'
        aria-label='정보 보기'>
        <Info className='text-gray-500 h-4 w-4' />
      </button>

      {showTooltip && (
        <div className='absolute right-full top-1/2 mr-2 -translate-y-1/2'>
          <div className='relative'>
            <div className='bg-gray-800 absolute left-full top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 transform' />
            <div className='bg-gray-800 whitespace-nowrap rounded-lg px-3 py-2 text-[1vw] text-black shadow-lg dark:text-white'>
              {text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
