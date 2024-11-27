function validateWebsite(value: string) {
  return value.length >= 2;
}
function validateDomain(value: string) {
  return /\..+/.test(value);
}
function validateIp(value: string) {
  const ipNumbers = value.split('.');
  const isValidIp =
    ipNumbers.length === 4 &&
    ipNumbers.every((num) => {
      const n = parseInt(num);
      return !isNaN(n) && n >= 0 && n <= 255;
    });

  return isValidIp;
}
function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export { validateWebsite, validateDomain, validateIp, validateEmail };
