import axios from 'utils/axios';

// eslint-disable-next-line import/prefer-default-export
export const fetchGitHubIssuesService = async () => {
  const response = await axios.get('/remotefalcon/api/controlPanel/gitHubIssues');
  return response;
};
