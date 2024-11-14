type Props<T> = {
  cssOption?: string;
  options: ReadonlyArray<{ readonly value: T; readonly label: string }>;
  value: string;
  onChange?: (value: T) => void;
};

export default function Select<T extends string>({
  cssOption,
  options = [] as ReadonlyArray<{ value: T; label: string }>,
  value,
  onChange = () => {}
}: Props<T>) {
  return (
    <select
      className={`min-w-0 bg-transparent ${cssOption}`}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className='overflow-hidden text-ellipsis whitespace-nowrap bg-white text-black'>
          {option.label || option.value}
        </option>
      ))}
    </select>
  );
}
