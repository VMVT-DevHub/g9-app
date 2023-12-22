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
  });

  const getMappedData = () => {
    if (!data?.GVTS?.Data) return [];

    const mappedData = data?.GVTS?.Data?.map((item) => {
      return {
        id: item[0],
        code: item[1],
        name: item[2],
        address: item[3],
      };
    });

    return mappedData;
  };

  return { data: getMappedData(), isLoading };
};

export const useIndicators = () => {
  const { data: indicators, isLoading } = useQuery(['indicators'], () => api.getIndicators(), {
    retry: false,
  });

  if (isLoading) return { indicatorGroups: [], indicatorGroupLabels: {}, indicatorOptions: [] };

  const indicatorGroups = getOptions(indicators?.Rodikliai?.Lookup?.Grupe);
  const indicatorGroupLabels = indicators?.Rodikliai?.Lookup?.Grupe || {};
  const indicatorOptions = indicators?.Rodikliai?.Data.map((item) => {
    return {
      id: item[0],
      groupId: item[1],
      name: item[3],
      code: item[2],
      min: item[5],
      max: item[6],
      step: item[7],
      unit: item[8],
      digitsAfterComma: countDigitsAfterComma(item[7]),
      description: item[9],
    };
  });

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
      onError: ({ response }) => {
        handleErrorToast();
      },
    },
  );

  const { indicatorOptions, indicators } = useIndicators();

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
    },
  );

  const mappedDeclaration = mapDeclaration(data);

  //disable if declared
  const disabled = mappedDeclaration.status == 3;

  //check if the form can be declared
  const canDeclare = mappedDeclaration.status == 2 && mappedDeclaration?.usersCount;

  return { mappedDeclaration, declarationLoading, lookup: data?.Lookup, disabled, canDeclare };
};
