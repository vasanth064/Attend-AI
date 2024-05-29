import PrivateRoute from '@/components/PrivateRoute';
import Admin from '@/pages/Admin';
import Home from '@/pages/Home';
import Signin from '@/pages/Signin';
import Signup from '@/pages/Signup';
import { RouteObject, createBrowserRouter } from 'react-router-dom';
interface Routes {
  path: string;
  element: React.ReactNode;
  children?: RouteObject[];
  isPrivate?: boolean;
  hidden?: boolean;
}
const routes = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        index: true,
        element: <Home />,
      },
      {
        path: '/admin',
        element: <Admin />
      }
    ],
    isPrivate: true,
    hidden: true,
  },
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },

] as Routes[]);

export default routes;
