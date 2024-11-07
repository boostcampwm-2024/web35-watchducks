export default function Loading() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75'>
      <div className='relative'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-blue-200' />
        <div className='absolute left-0 top-0 h-12 w-12 animate-spin rounded-full border-t-4 border-blue-500' />
      </div>
      <span className='ml-3 text-lg font-medium text-blue-500'>Loading...</span>
    </div>
  );
}
