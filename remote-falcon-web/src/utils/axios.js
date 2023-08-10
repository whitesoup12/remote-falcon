/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import Reactotron from 'reactotron-react-js';

const axiosServices = axios.create({
  baseURL: process?.env?.REACT_APP_BASE_API_PATH
});

// interceptor for http
axiosServices.interceptors.response.use(
  (response) => {
    if (process?.env?.REACT_APP_HOST_ENV === 'local') {
      Reactotron.apisauce(response);
    }
    return response;
  },
  (error) => {
    if (process?.env?.REACT_APP_HOST_ENV === 'local') {
      Reactotron.apisauce(error);
    }
    return Promise.reject(error);
  }
);

export default axiosServices;
