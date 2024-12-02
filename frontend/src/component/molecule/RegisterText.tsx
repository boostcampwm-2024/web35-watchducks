import CloudFlareDescriptionImg from '@asset/image/CloudFlareDescription.png';
import GabiaDescriptionImg from '@asset/image/GabiaDescription.png';
import H1 from '@component/atom/H1';
import Img from '@component/atom/Img';
import P from '@component/atom/P';

export default function RegisterText() {
  return (
    <div className='flex flex-col gap-[10px] text-[18px]'>
      <H1 cssOption='font-medium text-[50px] border-[2px]' content='등록 절차' />
      <P content='1. 프로젝트명, 도메인, 아이피 주소를 입력합니다.' />
      <P content='2. 등록 완료 후 표시된 네임 서버를 복사합니다.' />
      <P content='3. 상용 DNS (ex. Cloudflare, Gabia)의 가이드에 따라 네임 서버와 IP를 등록해 주세요.' />
      <P cssOption='mt-[20px] font-light' content='Gabia 예시' />
      <Img cssOption='bg-cover' src={GabiaDescriptionImg} alt='가비아 dns 등록 설명 이미지' />
      <P cssOption='mt-[20px] font-light' content='CloudFlare 예시' />
      <Img
        cssOption='bg-cover'
        src={CloudFlareDescriptionImg}
        alt='클라우드플레어 dns 등록 설명 이미지'
      />
    </div>
  );
}
