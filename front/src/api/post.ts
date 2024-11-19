import { FormState } from '@type/RegisterForm';

import { api } from './axios';

const postRegister = async (data: FormState) => {
  const response = await api.post('/project', data);
  return response.data;
};

export { postRegister };
