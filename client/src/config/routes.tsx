import Home from '@/pages/Home';
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
    element: <Home />,
    isPrivate: true,
    hidden: true,
  },
  {
    path: '/about',
    element: <div>About</div>,
  },
] as Routes[]);

export default routes;
