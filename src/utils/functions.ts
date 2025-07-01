import { endOfYear, format, isAfter, isBefore, isEqual, startOfYear } from 'date-fns';
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

export const getRole = (isAdmin: boolean) => (isAdmin ? 'Naudotojų administratorius' : 'Duomenų tiekėjas');

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

export const isDateInRange = (date: Date | string, min: Date | string, max: Date | string ): boolean => {
  const isDate = new Date(date).getTime();
  const minDate = new Date(min).getTime();
  const maxDate = new Date(max).getTime();

  return (
    (isAfter(isDate, minDate) || isEqual(isDate, minDate)) &&
    (isBefore(isDate, maxDate) || isEqual(isDate, maxDate))
  );

}

export const getUniqueIndicatorIds = (
  discrepancies?: ServerDiscrepancy,
  indicatorOptions?: IndicatorOption[],
): IndicatorOptionWithDiscrepancies[] => {
  if (!discrepancies || !indicatorOptions) return [];

  const indicators: any = {};

  mapArraysToJson(discrepancies.Kartojasi).forEach((item) => {
    indicators[item.Rodiklis] = {
      ...indicators[item.Rodiklis],
      repeats: indicators[item.Rodiklis]?.repeats || [],
    };

    indicators[item.Rodiklis].repeats.push({
      id: item.ID,
      date: item.Data,
      value: item.Reiksme,
      approved: item.Patvirtinta,
    });
  });

  mapArraysToJson(discrepancies.Trukumas).forEach((item) => {
    indicators[item.Rodiklis] = {
      ...indicators[item.Rodiklis],
      lack: {
        id: item.ID,
        approved: item.Patvirtinta,
        notes: item.Pastabos || '',
      },
    };
  });

  mapArraysToJson(discrepancies.Virsijimas).forEach((item) => {
    indicators[item.Rodiklis] = {
      ...indicators[item.Rodiklis],
      exceeded: indicators?.[item.Rodiklis]?.exceeded || [],
    };

    indicators[item.Rodiklis].exceeded.push({
      id: item.ID,
      dateFrom: item.Nuo,
      dateTo: item.Iki,
      max: item.Max,
      insignificant: item.Nereiksmingas,
      insignificantDescription: item.NereiksmApras,
      userCount: item.Zmones,
      type: item.Tipas,
      isBelowLOQ: item.LOQVerte,
      LOQValue: item.LOQReiksme,
      status: item.Statusas,
      approved: item.Patvirtinta,
      notes: item.Pastabos,
      startDate: item.Pradzia,
      reason: item.Priezastis,
      action: item.Veiksmas,
      endDate: item.Pabaiga,
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
    type: {
      value: declaration.Data[0][3],
      label: declaration?.Lookup.Stebesenos[declaration.Data[0][3]],
    },
    status: declaration.Data[0][4],
    waterQuantity: declaration?.Data?.[0]?.[5],
    usersCount: declaration?.Data[0]?.[6],
    waterMaterial: declaration?.Data?.[0]?.[7],
    waterPreparation: declaration?.Data?.[0]?.[16],
    isWaterBeingPrepared: declaration?.Data?.[0]?.[17],
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

export const getIndicatorLabel = (indicator: any) =>
  `${indicator?.name?.trim()}, (Kodas: ${indicator?.code?.trim()})`;

export const mapArraysToJson = (arrays: any) => {
  const fields = arrays.Fields;
  const data = arrays.Data;

  const objects: any[] = [];

  for (const i in data) {
    const value = data[i],
      object = {};
    for (const k in fields) {
      const field = fields[k];
      object[field] = value[k];
    }
    objects.push(object);
  }
  return objects;
};
