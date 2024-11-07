import { FormState } from '@type/RegisterForm';
import axios from 'axios';

const postRegister = async (data: FormState) => {
  const response = await axios.post('/api/register', data);
  return response.data;
};

export { postRegister };
