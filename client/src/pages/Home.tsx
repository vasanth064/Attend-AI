import {
  selectCurrentUser,
} from '@/redux/authentication/authSlice';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user } = useSelector(selectCurrentUser);
  return (
    <div>
      <h1>Hello {user?.name}</h1>
    </div>
  );
};

export default Home;
