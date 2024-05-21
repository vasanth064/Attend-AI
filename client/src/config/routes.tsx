import { Button } from '@/components/ui/button';
import { createBrowserRouter } from 'react-router-dom';

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <div>
        <h1>Hello Vite + React!</h1>
        <Button>Hello</Button>
      </div>
    ),
  },
  {
    path: '/about',
    element: <div>About</div>,
  },
]);

export default routes;
