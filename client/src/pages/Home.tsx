import {
  selectAccessToken,
  selectCurrentUser,
} from '@/redux/authentication/authSlice';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAccessToken);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.user?.userType === "ADMIN")
      navigate("/admin");
  }, [])
  return (
    <div>
      <h1>{JSON.stringify(user)}</h1>
      <h1>{JSON.stringify(token)}</h1>
    </div>
  );
};

export default Home;
