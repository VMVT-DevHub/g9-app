import { format } from 'date-fns';
import { toast } from 'react-toastify';

export const handleErrorToast = (message = 'Įvyko klaida, pabandykite vėliau') => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const handleSuccessToast = (message = 'Atnaujinta') => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const getRole = (isAdmin: boolean) => (isAdmin ? 'Administratorius' : 'Naudotojas');

export const getYesNo = (value: boolean) => (value ? 'Taip' : 'Ne');

export const countDigitsAfterComma = (number: string) => {
  const numberString = number.toString();

  const decimalIndex = numberString.indexOf('.');
  if (decimalIndex === -1) {
    return undefined;
  }

  const digitsAfterDecimal = numberString.length - decimalIndex - 1;
  return digitsAfterDecimal;
};

export const getOptions = (options?: { [key: string]: string }) => {
  if (!options) return [];

  return Object.keys(options).map((item) => item);
};

export const formatDate = (date?: Date | string) =>
  date ? format(new Date(date), 'yyyy-MM-dd') : '-';

export const inRange = (num: number, start: number, end: number) => {
  return num >= start && num <= end;
};
