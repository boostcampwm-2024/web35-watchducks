export default function Loading() {
  return (
    <div className='flex items-center justify-center gap-4 bg-opacity-75 p-4 text-center'>
      <div className='relative inline-flex'>
        <div className='absolute h-[12px] w-[12px] rounded-full border-[1.5px] border-gray' />
        <div className='h-[24px] w-[24px] animate-spin rounded-[31px] border-[1.5px] border-solid border-gray/30 border-t-gray [animation-duration:1.5s]' />
      </div>
      <span className='text-lg font-medium text-gray'>Loading...</span>
    </div>
  );
}
