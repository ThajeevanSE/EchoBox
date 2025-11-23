import { useEffect, useState } from 'react';
import { hydrateAuth } from '../store/slices/authSlice';
import { hydrateFavourites } from '../store/slices/favouritesSlice';
import { useAppDispatch } from './useRedux';

export const useAppInitialization = () => {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      await Promise.all([dispatch(hydrateAuth()), dispatch(hydrateFavourites())]);
      setReady(true);
    };

    bootstrap();
  }, [dispatch]);

  return ready;
};
