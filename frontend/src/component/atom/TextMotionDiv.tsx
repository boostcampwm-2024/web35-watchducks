import { motion } from 'framer-motion';

type Props = {
  cssOption?: string;
  content: string;
};

export default function TextMotionDiv({ cssOption, content = '' }: Props) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cssOption}>
      {content}
    </motion.div>
  );
}
