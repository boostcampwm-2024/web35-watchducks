const GENERATION_VALUE = {
  ALL: 'all',
  NINTH: '9th'
} as const;

const BOOST_CAMP_VALUE = {
  NINTH: '부스트캠프 9기'
} as const;

const GENERATION_OPTIONS = [
  { value: GENERATION_VALUE.ALL, label: '전체' },
  { value: GENERATION_VALUE.NINTH, label: '9기' }
] as const;

const BOOST_CAMP_OPTION = [{ value: '9', label: BOOST_CAMP_VALUE.NINTH }] as const;

export { GENERATION_OPTIONS, BOOST_CAMP_OPTION, GENERATION_VALUE, BOOST_CAMP_VALUE };
