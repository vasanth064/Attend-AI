import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectAccessToken,
  selectCurrentUser,
} from '@/redux/authentication/authSlice';

const PrivateRoute = () => {
  const token = useSelector(selectAccessToken);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  console.log(token, user);
  return token ? (
    <Outlet />
  ) : (
    <Navigate to='/signin' state={{ from: location }} replace />
  );
};

export default PrivateRoute;
