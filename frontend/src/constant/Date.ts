import { DateType } from '@type/Date';

const DAY_TO_MS_SECOND = 24 * 60 * 60 * 1000;

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
};

const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
};

const DATE_OPTIONS: { value: DateType; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' }
];

export { DAY_TO_MS_SECOND, DATE_FORMAT_OPTIONS, TIME_FORMAT_OPTIONS, DATE_OPTIONS };
