/**
 * Adaptor for axios
 */

import AxiosMockAdapter from 'axios-mock-adapter';

import axios from './axios';

const services = new AxiosMockAdapter(axios, { delayResponse: 1000 });
const mockServices = axios.defaults.adapter;
export { services, mockServices };
