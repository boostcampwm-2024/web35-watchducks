import { Moon, Sun } from 'lucide-react';

type Props = {
  isDark: boolean;
  toggleDarkMode: () => void;
};

export default function DarkModeButton({ isDark, toggleDarkMode }: Props) {
  return (
    <button
      onClick={toggleDarkMode}
      className='pointer-events-auto flex h-[50px] w-[50px] flex-shrink-0 items-center transition-transform duration-200 hover:scale-150'>
      {isDark ? (
        <Moon className='h-[3vw] w-[3vw] stroke-2 text-slate-700' />
      ) : (
        <Sun className='h-[3vw] w-[3vw] stroke-2 text-yellow-400' />
      )}
    </button>
  );
}
