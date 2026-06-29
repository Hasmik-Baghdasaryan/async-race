import { createBrowserRouter, type RouteObject } from 'react-router';

import App from '@/App';
import Garage from '@/pages/Garage';
import NotFoundPage from '@/pages/NotFoundPage';
import Winners from '@/pages/Winners';

const router: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Garage /> },
      { path: '/winners', element: <Winners /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export default createBrowserRouter(router);
