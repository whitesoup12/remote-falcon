// third-party
import jwt from 'jsonwebtoken';

// project imports
import { JWT_API } from 'config';
import { services } from 'utils/mockAdapter';

import coreInfo from './_mockData/coreInfo.mock';

// constant
const JWT_SECRET = JWT_API.secret;
const JWT_EXPIRES_TIME = JWT_API.timeout;

const delay = (timeout) => new Promise((res) => setTimeout(res, timeout));

let users = [
  {
    id: '5e86809283e28b96d2d38537',
    email: 'demo@remotefalcon.com',
    password: 'demo',
    name: 'John Doe'
  }
];

// ==============================|| MOCK SERVICES ||============================== //

services.onPost('/remotefalcon/api/account/signIn').reply(async (request) => {
  try {
    await delay(0);

    const { username, password } = request.auth;
    const email = username;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = JSON.parse(localUsers);
    }

    const user = users.find((_user) => _user.email === email);

    if (!user) {
      return [403];
    }

    if (user.password !== password) {
      return [401];
    }

    const userData = {
      'user-data': {
        showToken: coreInfo.showToken,
        email: coreInfo.email,
        showSubdomain: coreInfo.showSubdomain
      }
    };

    const serviceToken = jwt.sign(userData, JWT_SECRET, { expiresIn: JWT_EXPIRES_TIME });

    return [
      200,
      {
        ...coreInfo,
        serviceToken,
        isDemo: true
      }
    ];
  } catch (err) {
    return [500, { message: 'Server Error' }];
  }
});

services.onGet('/remotefalcon/api/controlPanel/coreInfo').reply(async () => {
  try {
    return [200, coreInfo];
  } catch (err) {
    return [500];
  }
});
