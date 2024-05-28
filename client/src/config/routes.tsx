import Layout from '@/components/Layout';
import PrivateRoute from '@/components/PrivateRoute';
import Home from '@/pages/Home';
import Sessions from '@/pages/Sessions';
import Signin from '@/pages/Signin';
import Signup from '@/pages/Signup';
import { createBrowserRouter } from 'react-router-dom';
interface Routes {
  path: string;
  title: string;
  roles: string[];
}
export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
  CLIENT = 'CLIENT',
  MACHINE = 'MACHINE',
}
const routerRoutes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <PrivateRoute />
      </Layout>
    ),
    children: [
      {
        path: '/',
        index: true,
        element: <Home />,
      },
      {
        path: '/client',
        children: [
          {
            path: 'sessions',
            element: <Sessions />,
          },
        ],
      },
    ],
  },
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

export const routes: Routes[] = [
  {
    path: '/',
    title: 'Home',
    roles: ['CLIENT', 'ADMIN'],
  },
  {
    path: '/client/sessions',
    title: 'Sessions',
    roles: ['CLIENT', 'ADMIN'],
  },
];
export default routerRoutes;
