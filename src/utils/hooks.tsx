import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { Tab } from '../Components/other/TabBar';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { actions, emptyUser } from '../state/user/reducer';
import api from './api';
import {
  countDigitsAfterComma,
  getOptions,
  getUniqueIndicatorIds,
  handleErrorToast,
  handleIsApproved,
  handleSuccessToast,
  mapArraysToJson,
  mapDeclaration,
} from './functions';

export const useWindowSize = (width: string) => {
  const [isInRange, setIsInRange] = useState(false);

  const handleResize = () => {
    const mediaQuery = window.matchMedia(width);
    setIsInRange(mediaQuery.matches);
  };

  useEffect(() => {
    handleResize();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isInRange;
};

export const useLogoutMutation = () => {
  const dispatch = useAppDispatch();

  const { mutateAsync } = useMutation(() => api.logout(), {
    onSuccess: () => {
      dispatch(actions.setUser(emptyUser));
    },
  });

  return { mutateAsync };
};

export const useGetCurrentRoute = (tabs: Tab[]) => {
  const currentLocation = useLocation();

  return tabs.find((tab) => matchPath({ path: tab.slug, end: false }, currentLocation.pathname));
};

export const useBusinessPlaces = () => {
  const { data, isLoading } = useQuery(['businessPlaces'], () => api.getBusinessPlaces(), {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const getMappedData = () => {
    if (!data?.GVTS?.Data) return [];

    const mappedData = mapArraysToJson(data?.GVTS)
      ?.map((item) => {
        return {
          id: item.ID,
          code: item.JA,
          name: item.Title,
          address: item.Addr,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return mappedData;
  };

  return { data: getMappedData(), isLoading };
};

export const useIndicators = (declarationType: any) => {
  const { data: indicators, isLoading } = useQuery(['indicators'], () => api.getIndicators(), {
    retry: false,
  });

  if (isLoading) return { indicatorGroups: [], indicatorGroupLabels: {}, indicatorOptions: [] };
  const currentDeclaration = indicators?.Stebesenos.find(
    (monitoring) => monitoring.ID === declarationType,
  );

  const indicatorGroupLabels = indicators?.Rodikliai?.Lookup?.Grupe || {};
  const indicatorOptions = mapArraysToJson(indicators?.Rodikliai)
    .filter((item) => !currentDeclaration || currentDeclaration?.Rodikliai.includes(item.ID))
    .map((item) => {
      return {
        id: item.ID,
        groupId: item.Grupe,
        name: item.Pavadinimas,
        code: item.Kodas,
        min: item.Min,
        max: item.Max,
        step: item.Step,
        unit: item.Vnt,
        digitsAfterComma: countDigitsAfterComma(item.Step),
        description: item.Aprasymas,
      };
    });

  const indicatorGroups = getOptions(indicators?.Rodikliai?.Lookup?.Grupe).filter((groupId) =>
    indicatorOptions?.some((item) => item.groupId == groupId),
  );

  return { indicatorGroups, indicatorGroupLabels, indicatorOptions, indicators };
};

export const useSuccess = () => {
  const queryClient = useQueryClient();

  const handleSuccess = async () => {
    await queryClient.invalidateQueries(['discrepancies']);
    await queryClient.invalidateQueries(['indicators']);
    handleSuccessToast();
  };

  return { handleSuccess };
};

export const useMappedIndicatorsWithDiscrepancies = () => {
  const { id = '' } = useParams();

  const { data: discrepancies, isLoading } = useQuery(
    ['discrepancies', id],
    () => api.getDiscrepancies(id),
    {
      retry: false,
      onError: () => {
        handleErrorToast();
      },
    },
  );

  const { indicatorOptions, indicators } = useIndicators('');

  const [mappedIndicators, setMappedIndicators] = useState(
    getUniqueIndicatorIds(discrepancies, indicatorOptions),
  );

  useEffect(() => {
    setMappedIndicators(getUniqueIndicatorIds(discrepancies, indicatorOptions));
  }, [discrepancies, indicators]);

  const isAllApproved =
    mappedIndicators.filter((item) => handleIsApproved(item)).length === mappedIndicators.length;

  return { mappedIndicators, isLoading, indicatorOptions, discrepancies, isAllApproved };
};

export const useIsAdmin = () => {
  const { id = '' } = useParams();

  const adminRoles = useAppSelector((state) => state.user.userData.adminRoles);

  const isAdmin = adminRoles.includes(Number(id));

  return isAdmin;
};

export const useGetAdmin = () => {
  const { id = '' } = useParams();

  const adminRoles = useAppSelector((state) => state.user.userData.adminRoles);

  const isAdmin = adminRoles.includes(Number(id));

  return isAdmin;
};

export const useDeclaration = () => {
  const { id = '' } = useParams();

  const { data, isLoading: declarationLoading } = useQuery(
    ['declaration', id],
    () => api.getDeclaration(id),
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const mappedDeclaration = mapDeclaration(data);

  //disable if declared
  const disabled = mappedDeclaration.status == 3;

  //check if the form can be declared
  const canDeclare = mappedDeclaration.status == 2 && mappedDeclaration?.usersCount;

  return { mappedDeclaration, declarationLoading, lookup: data?.Lookup, disabled, canDeclare };
};
