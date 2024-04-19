import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const INSERT_VIEWER_PAGE_STATS = gql`
  mutation ($date: String!) @api(name: viewer) {
    insertViewerPageStats(date: $date)
  }
`;
