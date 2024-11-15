export default function Loading() {
  return (
    <div className='flex items-center justify-center gap-4 bg-white bg-opacity-75 p-4 text-center'>
      <div className='relative inline-flex'>
        <div className='absolute h-12 w-12 rounded-full border-1.5 border-gray' />
        <div className='h-24 w-24 animate-spin rounded-31 border-1.5 border-solid border-gray/30 border-t-gray [animation-duration:1.5s]' />
      </div>
      <span className='text-lg font-medium text-gray'>Loading...</span>
    </div>
  );
}
