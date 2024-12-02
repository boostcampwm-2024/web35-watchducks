export default function MobileLayout() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='mx-4 rounded-lg bg-white p-6 text-center shadow-lg'>
        <h2 className='text-navy mb-4 text-xl font-bold'>데스크톱으로 접속해주세요!</h2>
        <p className='text-gray-600'>
          이 서비스는 768px 이상의 화면에서 최적의 경험을 제공합니다.
          <br />
          데스크톱 환경에서 접속해주세요.
        </p>
      </div>
    </div>
  );
}
