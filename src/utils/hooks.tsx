import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useAppDispatch } from '../state/hooks';
import { actions, emptyUser } from '../state/user/reducer';
import api from './api';

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
