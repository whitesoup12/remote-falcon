/* eslint-disable import/no-extraneous-dependencies */
import apisaucePlugin from 'reactotron-apisauce';
import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.configure().use(apisaucePlugin()).use(reactotronRedux()).connect();

console.tron = Reactotron;

export default reactotron;
