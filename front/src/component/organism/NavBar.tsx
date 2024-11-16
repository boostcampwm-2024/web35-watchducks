import NavbarMenu from '@component/molecule/NavbarMenu';
import NavbarRanking from '@component/molecule/NavbarRanking';
import NavbarTitle from '@component/molecule/NavbarTitle';
import NavigateButton from '@component/molecule/NavigateButton';
import NavbarSelectWrapper from '@component/organism/NavbarSelectWrapper';
import { BOOST_CAMP_OPTION, GENERATION_VALUE } from '@constant/NavbarSelect';
import { useState } from 'react';

import CustomErrorBoundary from '@/boundary/CustomErrorBoundary';

export default function Navbar() {
  const [generation, setGeneration] = useState<string>(GENERATION_VALUE.NINTH);
  const [selectedGroup, setSelectedGroup] = useState<string>(BOOST_CAMP_OPTION[0].value);

  return (
    <div className='flex flex-col gap-16 px-24 pt-24'>
      <NavbarTitle />
      <NavbarSelectWrapper
        generation={generation}
        selectedGroup={selectedGroup}
        setGeneration={setGeneration}
        setSelectedGroup={setSelectedGroup}
      />
      <NavbarMenu />
      <CustomErrorBoundary>
        <NavbarRanking />
      </CustomErrorBoundary>
      <NavigateButton
        path='/register'
        content='프로젝트 등록하러가기'
        cssOption='bg-blue rounded-10 text-white text-10 md:text-12 p-16 flex items-center whitespace-nowrap hover:text-black'
      />
    </div>
  );
}
