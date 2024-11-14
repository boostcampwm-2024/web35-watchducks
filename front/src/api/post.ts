import { FormState } from '@type/RegisterForm';
import axios from 'axios';

const postRegister = async (data: FormState) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/project`, data);
  return response.data;
};

export { postRegister };
