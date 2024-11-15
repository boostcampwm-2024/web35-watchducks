import useTotalDatas from '@hook/useTotalDatas';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MainPage() {
  const { data } = useTotalDatas();
  const [displayValue, setDisplayValue] = useState(data.count);

  useEffect(() => {
    setDisplayValue(data.count);
  }, [data.count]);

  return (
    <div className='flex h-screen w-full bg-gray-50'>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className='text-xl font-bold'>
        {displayValue}
      </motion.div>
    </div>
  );
}
