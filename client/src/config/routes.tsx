import Layout from '@/components/Layout';
import PrivateRoute from '@/components/PrivateRoute';
import CreateInvite from '@/pages/CreateInvite';
import Home from '@/pages/Home';
import InviteForm from '@/pages/InviteForm';
import Invites from '@/pages/Invites';
import Machines from '@/pages/Machines';
import Sessions from '@/pages/Sessions';
import Signin from '@/pages/Signin';
import Signup from '@/pages/Signup';
import { createBrowserRouter } from 'react-router-dom';
import Admin from '@/pages/Admin';
import UserPage from '@/pages/UserPage';
import UserEnrollmentsTable from '@/components/UserEnrollmentsTable';
import UserAttendanceReport from '@/components/UserAttendanceReport';
import InviteLink from '@/pages/InviteLink';
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
        path: '/admin',
        element: <Admin />,
      },
      {
        path: '/user',
        element: <UserPage />,
        children: [
          {
            path: 'enrollments',
            element: <UserEnrollmentsTable />,
          },
          {
            path: 'report',
            element: <UserAttendanceReport />,
          },
        ],
      },
      {
        path: '/client',
        children: [
          {
            path: 'sessions',
            element: <Sessions />,
          },
          {
            path: 'invites',
            element: <Invites />,
          },
          {
            path: 'machines',
            element: <Machines />,
          },
          {
            path: 'invites/create',
            element: <CreateInvite />,
          },
          {
            path: 'invites/:inviteId',
            element: <InviteForm previewMode={true} />,
          },
        ],
      },
    ],
  },
  {
    path: '/invite/:inviteId',
    element: <InviteLink />,
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
  {
    path: '/client/invites',
    title: 'Invites',
    roles: ['CLIENT', 'ADMIN'],
  },
  {
    path: '/client/machines',
    title: 'Machines',
    roles: ['CLIENT', 'ADMIN'],
  },
  {
    path: '/admin',
    title: 'Admin',
    roles: ['ADMIN'],
  },
  {
    path: '/user',
    title: 'Home',
    roles: ['USER'],
  },
  {
    path: '/user/enrollments',
    title: 'Enrollments',
    roles: ['USER'],
  },
  {
    path: '/user/report',
    title: 'Report',
    roles: ['USER'],
  },
];
export default routerRoutes;
