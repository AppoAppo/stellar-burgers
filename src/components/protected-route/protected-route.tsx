import { ReactElement } from 'react';
import { getCookie } from '../../utils/cookie';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuth, selectIsUserChecked } from '../../services/slices/user';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isUserChecked = useSelector(selectIsUserChecked);
  const isAuth = selectIsAuth;
  const isUserAuth = Boolean(getCookie('accessToken')) && isAuth;
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' };

  if (!isUserChecked) {
    return <Preloader />;
  }
  if (!onlyUnAuth && !isUserAuth) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && isUserAuth) {
    return (
      <Navigate
        to={from}
        state={{ background: from?.state?.location }}
        replace
      />
    );
  }

  return children;
};
