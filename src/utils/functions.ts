import { endOfYear, format, startOfYear } from 'date-fns';
import { toast } from 'react-toastify';
import {
  IndicatorOption,
  IndicatorOptionWithDiscrepancies,
  ServerDeclaration,
  ServerDiscrepancy,
} from '../types';

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

export const getUniqueIndicatorIds = (
  discrepancies?: ServerDiscrepancy,
  indicatorOptions?: IndicatorOption[],
): IndicatorOptionWithDiscrepancies[] => {
  if (!discrepancies || !indicatorOptions) return [];

  const indicators: any = {};

  discrepancies.Kartojasi.Data.forEach((item) => {
    indicators[item[1]] = {
      ...indicators[item[1]],
      repeats: indicators[item[1]]?.repeats || [],
    };

    indicators[item[1]].repeats.push({
      id: item[0],
      date: item[2],
      value: item[3],
      approved: item[4],
    });
  });

  discrepancies.Trukumas.Data.forEach((item) => {
    indicators[item[1]] = {
      ...indicators[item[1]],
      lack: {
        id: item[0],
        approved: item[5],
        notes: item[6] || '',
      },
    };
  });

  discrepancies.Virsijimas.Data.forEach((item) => {
    indicators[item[1]] = {
      ...indicators[item[1]],
      exceeded: indicators?.[item[1]]?.exceeded || [],
    };

    indicators[item[1]].exceeded.push({
      id: item[0],
      dateFrom: item[2],
      dateTo: item[3],
      max: item[4],
      insignificant: item[6],
      insignificantDescription: item[7],
      userCount: item[8],
      type: item[9],
      isBelowLOQ: item[10],
      LOQValue: item[11],
      status: item[12],
      approved: item[13],
      notes: item[14],
    });
  });

  return indicatorOptions
    .reduce((filteredIndicators: any[], currentIndicator) => {
      if (indicators[currentIndicator.id]) {
        filteredIndicators.push({
          ...currentIndicator,
          data: indicators[currentIndicator.id],
        });
      }

      return filteredIndicators;
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item, index) => ({ ...item, index }));
};

export const handleIsApproved = (indicator: IndicatorOptionWithDiscrepancies) => {
  const isApproved =
    (!indicator?.data?.exceeded || indicator?.data?.exceeded?.every((item) => item.approved)) &&
    (!indicator?.data?.repeats || indicator?.data?.repeats?.every((item) => item.approved)) &&
    (!indicator?.data?.lack || indicator?.data?.lack?.approved);

  return isApproved;
};

export const mapDeclaration = (declaration?: ServerDeclaration) => {
  if (!declaration) return {};

  return {
    year: declaration?.Data[0][2],
    type: declaration?.Lookup.Stebesenos[declaration.Data[0][3]],
    status: declaration.Data[0][4],
    waterQuantity: declaration?.Data?.[0]?.[5],
    usersCount: declaration?.Data[0]?.[6],
    waterMaterial: declaration?.Data?.[0]?.[7],
  };
};

export const getYearRange = (year: string) => {
  const yearDate = new Date(`${year}-01-01`);

  const minDate = startOfYear(yearDate);
  const maxDate = endOfYear(yearDate);

  return { minDate, maxDate };
};

export const getGroupedIndicatorValues = (values: any) => {
  return values?.Data.reduce((groupedValues, currentValue) => {
    groupedValues[currentValue[2]] = groupedValues[currentValue?.[2]] || [];

    groupedValues[currentValue[2]].push({
      id: currentValue[0],
      indicatorId: currentValue[2],
      date: currentValue[3],
      value: currentValue[4],
    });

    return groupedValues;
  }, {});
};
