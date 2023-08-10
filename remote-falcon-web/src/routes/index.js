import { useRoutes } from 'react-router-dom';

import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import ViewerRoutes from './ViewerRoutes';

export default function ThemeRoutes() {
  return useRoutes([LoginRoutes, MainRoutes, ViewerRoutes]);
}
