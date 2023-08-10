import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

import Loadable from 'ui-component/Loadable';
import ViewerGuard from 'utils/route-guard/ViewerGuard';

const ExternalViewerPage = Loadable(lazy(() => import('views/pages/externalViewer')));

const ViewerRoutes = {
  path: '/',
  element: (
    <ViewerGuard>
      <ExternalViewerPage />
    </ViewerGuard>
  ),
  children: [
    {
      path: '/',
      element: <ExternalViewerPage />
    },
    {
      path: '/remote-falcon',
      element: <ExternalViewerPage />
    },
    {
      path: '/remoteFalcon',
      element: <Navigate to="/remote-falcon" />
    }
  ]
};

export default ViewerRoutes;
