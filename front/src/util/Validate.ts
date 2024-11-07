function validateWebsite(value: string) {
  return value.length >= 2;
}
function validateDomain(value: string) {
  return /^www\..+/.test(value);
}
function validateIp(value: string) {
  const [ipPart, portPart] = value.split(':');

  if (!portPart) return false;

  const ipNumbers = ipPart.split('.');
  const isValidIp =
    ipNumbers.length === 4 &&
    ipNumbers.every((num) => {
      const n = parseInt(num);
      return !isNaN(n) && n >= 0 && n <= 255;
    });

  const port = parseInt(portPart);
  return isValidIp && !isNaN(port) && port >= 0 && port <= 65535;
}
function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export { validateWebsite, validateDomain, validateIp, validateEmail };
