import axios from 'axios';

const getGroupNames = async (generation: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/project?generation=${generation}`
  );
  return response.data;
};

const getRakings = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/log/traffic/rank`);
  return response.data;
};

const getTotalTraffic = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/log/traffic/`);
  return response.data;
};

export { getGroupNames, getRakings, getTotalTraffic };
