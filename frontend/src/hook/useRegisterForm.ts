import { postRegister } from '@api/post';
import { GENERATION_VALUE } from '@constant/NavbarSelect';
import useCustomMutation from '@hook/useCustomMutation';
import { FormState, ValidationState } from '@type/RegisterForm';
import { validateWebsite, validateDomain, validateIp, validateEmail } from '@util/Validate';
import { useState, useEffect } from 'react';

type Props = {
  successCallback: (message: string) => void;
  errorCallback: (message: string) => void;
};

export default function useRegisterForm({ successCallback, errorCallback }: Props) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    domain: '',
    ip: '',
    email: '',
    generation: GENERATION_VALUE.NINTH
  });
  const [validation, setValidation] = useState<ValidationState>({
    isValidName: false,
    isValidDomain: false,
    isValidIp: false,
    isValidEmail: false
  });
  const [isAllValid, setIsAllValid] = useState<boolean>(false);

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

  const mutation = useCustomMutation({
    mutationFn: postRegister,
    onSuccess: () => {
      successCallback('작성하신 이메일로 네임서버 주소를 보냈어요!');
      setFormData({
        name: '',
        domain: '',
        ip: '',
        email: '',
        generation: GENERATION_VALUE.NINTH
      });
    },
    onError: () => {
      errorCallback('에러발생!');
    }
  });

  const handleChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [key]: e.target.value
    }));
  };

  const handleSelectChange = (key: keyof FormState) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
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
    handleSelectChange,
    isLoading: mutation.isPending,
    isAllValid
  };
}
