import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import NavigationScroll from 'layout/NavigationScroll';
import Routes from 'routes';
import ThemeCustomization from 'themes';
import Snackbar from 'ui-component/extended/Snackbar';
import Locales from 'ui-component/Locales';
import RTLLayout from 'ui-component/RTLLayout';

const App = () => (
  <ThemeCustomization>
    {/* RTL layout */}
    <RTLLayout>
      <Locales>
        <NavigationScroll>
          <AuthProvider>
            <>
              <Routes />
              <Snackbar />
            </>
          </AuthProvider>
        </NavigationScroll>
      </Locales>
    </RTLLayout>
  </ThemeCustomization>
);

export default App;
