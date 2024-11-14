import CustomErrorBoundary from '@boundary/CustomErrorBoundary';
import NavbarMenu from '@component/molecule/NavbarMenu';
import NavbarTitle from '@component/molecule/NavbarTitle';
import NavbarSelectWrapper from '@component/organism/NavbarSelectWrapper';
import { BOOST_CAMP_OPTION, GENERATION_VALUE } from '@constant/NavbarSelect';
import { Generation } from '@type/Navbar';
import { useState } from 'react';

import NavigateButton from '../molecule/NavigateButton';

export default function Navbar() {
  const [generation, setGeneration] = useState<Generation>(GENERATION_VALUE.ALL);
  const [selectedGroup, setSelectedGroup] = useState<string>(BOOST_CAMP_OPTION[0].value);

  return (
    <div className='flex flex-col gap-16 px-24 pt-24'>
      <NavbarTitle />
      <CustomErrorBoundary>
        <NavbarSelectWrapper
          generation={generation}
          selectedGroup={selectedGroup}
          setGeneration={setGeneration}
          setSelectedGroup={setSelectedGroup}
        />
      </CustomErrorBoundary>
      <NavbarMenu />
      <NavigateButton
        path='/register'
        content='프로젝트 등록하러가기'
        cssOption='bg-blue rounded-10 text-white text-10 md:text-12 p-16 flex items-center whitespace-nowrap hover:text-black'
      />
    </div>
  );
}
