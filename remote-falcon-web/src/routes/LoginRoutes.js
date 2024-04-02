import { lazy } from 'react';

import MinimalLayout from 'layout/MinimalLayout';
import NavMotion from 'layout/NavMotion';
import Loadable from 'ui-component/Loadable';
import GuestGuard from 'utils/route-guard/GuestGuard';

const Landing = Loadable(lazy(() => import('views/pages/landing')));
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/Register')));
const AuthForgotPassword = Loadable(lazy(() => import('views/pages/authentication/ForgotPassword')));
const VerifyEmail = Loadable(lazy(() => import('views/pages/authentication/VerifyEmail')));
const ResetPassword = Loadable(lazy(() => import('views/pages/authentication/ResetPassword')));

const LoginRoutes = {
  path: '/',
  element: (
    <NavMotion>
      <GuestGuard>
        <MinimalLayout />
      </GuestGuard>
    </NavMotion>
  ),
  children: [
    {
      path: '/',
      element: <Landing />
    },
    {
      path: '/signin',
      element: <AuthLogin />
    },
    {
      path: '/signup',
      element: <AuthRegister />
    },
    {
      path: '/verifyEmail/:showToken/:showSubdomain',
      element: <VerifyEmail />
    },
    {
      path: '/forgot',
      element: <AuthForgotPassword />
    },
    {
      path: '/resetPassword/:passwordResetLink',
      element: <ResetPassword />
    }
  ]
};

export default LoginRoutes;
