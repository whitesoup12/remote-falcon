import mixpanel from 'mixpanel-browser';
import DataDog from 'react-datadog';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import '_mockApis';

import App from 'App';
import { BASE_PATH } from 'config';
import { ConfigProvider } from 'contexts/ConfigContext';
import reportWebVitals from 'reportWebVitals';
import * as serviceWorker from 'serviceWorker';
import { store } from 'store';

import 'assets/scss/style.scss';

ReactDOM.render(
  <DataDog
    applicationId="bd3037df-6473-4ced-ae36-e7ab72461eab"
    clientToken={process?.env?.REACT_APP_DATADOG_CLIENT_TOKEN}
    service="remote-falcon-web"
    env={process?.env?.REACT_APP_HOST_ENV}
    sessionReplayRecording
    trackUserInteractions
    enableExperimentalFeatures={['clickmap']}
  >
    <Provider store={store}>
      <ConfigProvider>
        <BrowserRouter basename={BASE_PATH}>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </DataDog>,
  document.getElementById('root')
);

if (process?.env?.REACT_APP_MIXPANEL_API_KEY) {
  mixpanel.init(process?.env?.REACT_APP_MIXPANEL_API_KEY);
  mixpanel.register({ Environment: process?.env?.REACT_APP_HOST_ENV });
} else {
  mixpanel.init('*');
  mixpanel.disable();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
