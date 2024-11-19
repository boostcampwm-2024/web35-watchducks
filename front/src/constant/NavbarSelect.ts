import { GroupOption } from '@type/Navbar';

const GENERATION_VALUE = {
  NINTH: '9',
  TENTH: '10'
} as const;

const BOOST_CAMP_VALUE = {
  NINTH: '부스트캠프 9기',
  Text: '부스트캠프 10기'
} as const;

const GENERATION_OPTION = [{ value: GENERATION_VALUE.NINTH, label: '9기' }] as const;

const BOOST_CAMP_OPTION: GroupOption[] = [{ value: '9', label: BOOST_CAMP_VALUE.NINTH }];

export { GENERATION_OPTION, BOOST_CAMP_OPTION, GENERATION_VALUE, BOOST_CAMP_VALUE };
