// project imports
import { services } from 'utils/mockAdapter';

import dashboardStats from './_mockData/dashboardStats.mock';
import defaultViewerPageContent from './_mockData/defaultViewerPageContent.mock';
import remotePrefs from './_mockData/remotePrefs.mock';
import remoteViewerPages from './_mockData/remoteViewerPages.mock';
import saveUserProfile from './_mockData/saveUserProfile.mock';
import sequences from './_mockData/sequences.mock';

// eslint-disable-next-line no-unused-vars
const delay = (timeout) => new Promise((res) => setTimeout(res, timeout));

// ==============================|| MOCK SERVICES ||============================== //

services.onGet('/remotefalcon/api/controlPanel/remotePrefs').reply(async () => [200, remotePrefs]);

services.onPost('/remotefalcon/api/controlPanel/dashboardStats').reply(async () => [200, dashboardStats]);

services.onPost('/remotefalcon/api/controlPanel/userProfile').reply(async () => [200, saveUserProfile]);

services.onGet('/remotefalcon/api/controlPanel/sequences').reply(async () => [200, sequences]);

services.onPost('/remotefalcon/api/controlPanel/requestApiAccess').reply(async () => [200]);

services.onPost('/remotefalcon/api/controlPanel/updatePassword/v2').reply(async () => [200]);

services.onPost('/remotefalcon/api/controlPanel/remotePrefs').reply(async () => [200]);

services.onPost('/remotefalcon/api/controlPanel/playSequence').reply(async () => [200]);

services.onPost('/remotefalcon/api/controlPanel/toggleSequenceVisibility').reply(async () => [200]);

services.onDelete(new RegExp('/remotefalcon/api/controlPanel/deleteSequence/*')).reply(async () => [200]);

services.onGet('/remotefalcon/api/controlPanel/getDefaultViewerPageContent').reply(async () => [200, defaultViewerPageContent]);

services.onGet('/remotefalcon/api/controlPanel/remoteViewerPages').reply(async () => [200, remoteViewerPages]);

services.onDelete('/remotefalcon/api/controlPanel/purgeQueue').reply(async () => [200]);

services.onPost('/remotefalcon/api/controlPanel/updateSequenceDetails').reply(async () => [200]);
