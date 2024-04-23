import { gql } from '@apollo/client';

export const INSERT_VIEWER_PAGE_STATS = gql`
  mutation ($date: String!) @api(name: viewer) {
    insertViewerPageStats(date: $date)
  }
`;

export const UPDATE_ACTIVE_VIEWERS = gql`
  mutation @api(name: viewer) {
    updateActiveViewers
  }
`;

export const ADD_SEQUENCE_TO_QUEUE = gql`
  mutation ($name: String!, $latitude: Float, $longitude: Float) @api(name: viewer) {
    addSequenceToQueue(name: $name, latitude: $latitude, longitude: $longitude)
  }
`;

export const VOTE_FOR_SEQUENCE = gql`
  mutation ($name: String!, $latitude: Float, $longitude: Float) @api(name: viewer) {
    voteForSequence(name: $name, latitude: $latitude, longitude: $longitude)
  }
`;
