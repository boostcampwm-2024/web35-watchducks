type FormState = {
  name: string;
  domain: string;
  ip: string;
  email: string;
  generation: string;
};

type ValidationState = {
  isValidName: boolean;
  isValidDomain: boolean;
  isValidIp: boolean;
  isValidEmail: boolean;
};

export type { FormState, ValidationState };
