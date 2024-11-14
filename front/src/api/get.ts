import axios from 'axios';

const getGroups = async (generation: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/project?generation=${generation}`
  );
  return response.data;
};

export { getGroups };
