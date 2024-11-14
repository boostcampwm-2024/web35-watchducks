import FirstMedal from '@asset/image/FirstMedal.png';
import SecondMedal from '@asset/image/SecondMedal.png';
import ThirdMedal from '@asset/image/ThirdMedal.png';

const MEDALS = {
  0: {
    image: FirstMedal,
    color: 'text-amber-400'
  },
  1: {
    image: SecondMedal,
    color: 'text-gray-400'
  },
  2: {
    image: ThirdMedal,
    color: 'text-amber-700'
  }
} as const;

export { MEDALS };
