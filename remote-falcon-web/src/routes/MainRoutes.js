import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

const Landing = Loadable(lazy(() => import('views/pages/landing')));
const Dashboard = Loadable(lazy(() => import('views/pages/controlPanel/dashboard')));
const ViewerSettings = Loadable(lazy(() => import('views/pages/controlPanel/viewerSettings')));
const ViewerPage = Loadable(lazy(() => import('views/pages/controlPanel/viewerPage')));
const Sequences = Loadable(lazy(() => import('views/pages/controlPanel/sequences')));
const AccountSettings = Loadable(lazy(() => import('views/pages/controlPanel/accountSettings')));
const ViewerPageTemplates = Loadable(lazy(() => import('views/pages/controlPanel/viewerPageTemplates')));
const Tracker = Loadable(lazy(() => import('views/pages/controlPanel/tracker')));

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <Landing />
    },
    {
      path: '/control-panel',
      element: <Navigate to="/control-panel/dashboard" />
    },
    {
      path: '/control-panel/account-settings',
      element: <AccountSettings />
    },
    {
      path: '/control-panel/dashboard',
      element: <Dashboard />
    },
    {
      path: '/control-panel/remote-falcon-settings',
      element: <ViewerSettings />
    },
    {
      path: '/control-panel/viewer-page',
      element: <ViewerPage />
    },
    {
      path: '/control-panel/sequences',
      element: <Sequences />
    },
    {
      path: '/control-panel/viewer-page-templates',
      element: <ViewerPageTemplates />
    },
    {
      path: '/control-panel/remote-falcon-tracker',
      element: <Tracker />
    }
  ]
};

export default MainRoutes;
