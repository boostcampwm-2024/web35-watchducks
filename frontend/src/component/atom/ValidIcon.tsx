type Props = {
  type: 'success' | 'fail';
};

export default function Icon({ type = 'fail' }: Props) {
  return (
    <span className={`${type === 'success' ? 'text-green' : 'text-red'}`}>
      {type === 'success' ? '✓' : '✕'}
    </span>
  );
}
