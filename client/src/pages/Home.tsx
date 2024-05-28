import {
  selectAccessToken,
  selectCurrentUser,
} from '@/redux/authentication/authSlice';
import { useSelector } from 'react-redux';

const Home = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAccessToken);
  return (
    <div>
      <h1>{JSON.stringify(user)}</h1>
      <h1>{JSON.stringify(token)}</h1>
    </div>
  );
};

export default Home;
