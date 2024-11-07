import { postRegister } from '@api/post';
import { useMutation } from '@tanstack/react-query';
import { validateWebsite, validateDomain, validateIp, validateEmail } from '@util/Validate';
import { useState, useEffect } from 'react';

import { FormState, ValidationState } from '@/type/RegisterForm';

type Props = {
  successCallback: (message: string) => void;
  errorCallback: (message: string) => void;
};

export default function useRegisterForm({ successCallback, errorCallback }: Props) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    domain: '',
    ip: '',
    email: ''
  });
  const [validation, setValidation] = useState<ValidationState>({
    isValidName: false,
    isValidDomain: false,
    isValidIp: false,
    isValidEmail: false
  });
  const [isAllValid, setIsAllValid] = useState(false);

  useEffect(() => {
    setValidation({
      isValidName: validateWebsite(formData.name),
      isValidDomain: validateDomain(formData.domain),
      isValidIp: validateIp(formData.ip),
      isValidEmail: validateEmail(formData.email)
    });
  }, [formData]);

  useEffect(() => {
    setIsAllValid(Object.values(validation).every(Boolean));
  }, [validation]);

  const mutation = useMutation({
    mutationFn: postRegister,
    onSuccess: () => {
      successCallback('작성하신 이메일로 네임서버 주소를 보냈어요!');
      setFormData({
        name: '',
        domain: '',
        ip: '',
        email: ''
      });
    },
    onError: () => {
      errorCallback('중복된 도메인입니다!');
    }
  });

  const handleChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [key]: e.target.value
    }));
  };

  const handleSubmit = () => {
    if (isAllValid) {
      mutation.mutate(formData);
    }
  };

  return {
    formData,
    validation,
    handleChange,
    handleSubmit,
    isLoading: mutation.isPending,
    isAllValid
  };
}
