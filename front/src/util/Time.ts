const generateTimeSlots = () => {
  const result: Array<[string, number]> = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const startDate = new Date(yesterday);
  startDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < 144; i++) {
    const timestamp = new Date(startDate);
    timestamp.setMinutes(i * 10);
    const formattedTime = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')} ${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}:00`;

    result.push([formattedTime, 0]);
  }
  return result;
};

const fillEmptySlots = (rawData: Array<[string, string]>) => {
  const timeSlots = generateTimeSlots();
  const dataMap = new Map(rawData.map(([timestamp, value]) => [timestamp, Number(value)]));
  return timeSlots.map(([timestamp]) => [timestamp, dataMap.get(timestamp) || 0]);
};


export { fillEmptySlots };