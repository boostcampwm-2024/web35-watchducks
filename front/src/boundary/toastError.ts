import { AxiosError } from 'axios';

type ErrorCodeType = {
  [key: string]: { code: string; message: string };
};

const ERROR_CODE: ErrorCodeType = {
  default: { code: 'ERROR', message: '알 수 없는 오류가 발생했습니다.' },

  ERR_NETWORK: {
    code: '통신 에러',
    message: '서버가 응답하지 않습니다.'
  },

  ECONNABORTED: { code: '요청 시간 초과', message: '요청 시간을 초과했습니다.' },

  400: { code: '400', message: '잘못된 요청.' }
} as const;

export const getErrorByCode = (error: AxiosError<{ code: number; message: string }>) => {
  const serverErrorCode = error?.response?.data?.code ?? '';
  const httpErrorCode = error?.response?.status ?? '';
  const axiosErrorCode = error?.code ?? '';
  if (serverErrorCode in ERROR_CODE) {
    return ERROR_CODE[serverErrorCode as keyof typeof ERROR_CODE];
  }
  if (httpErrorCode in ERROR_CODE) {
    return ERROR_CODE[httpErrorCode as keyof typeof ERROR_CODE];
  }
  if (axiosErrorCode in ERROR_CODE) {
    return ERROR_CODE[axiosErrorCode as keyof typeof ERROR_CODE];
  }
  return ERROR_CODE.default;
};
