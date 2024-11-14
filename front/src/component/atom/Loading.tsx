export default function Loading() {
  return (
    <div className='flex items-center justify-center bg-white bg-opacity-75 p-4 text-center'>
      <div className='relative inline-flex'>
        <div className='absolute h-12 w-12 rounded-full border-4 border-gray-200' />
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue border-t-transparent [animation-duration:1.5s]' />
      </div>
      <span className='text-lg font-medium text-gray'>Loading...</span>
    </div>
  );
}
