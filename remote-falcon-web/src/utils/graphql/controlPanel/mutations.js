import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation ($firstName: String, $lastName: String, $showName: String!) @api(name: controlPanel) {
    signUp(firstName: $firstName, lastName: $lastName, showName: $showName)
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ($email: String!) @api(name: controlPanel) {
    forgotPassword(email: $email)
  }
`;

export const VERIFY_EMAIL = gql`
  mutation ($showToken: String!) @api(name: controlPanel) {
    verifyEmail(showToken: $showToken)
  }
`;

export const RESET_PASSWORD = gql`
  mutation @api(name: controlPanel) {
    resetPassword
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation @api(name: controlPanel) {
    updatePassword
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation ($userProfile: UserProfileInput!) @api(name: controlPanel) {
    updateUserProfile(userProfile: $userProfile)
  }
`;

export const REQUEST_API_ACCESS = gql`
  mutation @api(name: controlPanel) {
    requestApiAccess
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation @api(name: controlPanel) {
    deleteAccount
  }
`;

export const UPDATE_PAGES = gql`
  mutation ($pages: [PageInput]!) @api(name: controlPanel) {
    updatePages(pages: $pages)
  }
`;

export const UPDATE_PREFERENCES = gql`
  mutation ($preferences: PreferenceInput!) @api(name: controlPanel) {
    updatePreferences(preferences: $preferences)
  }
`;

export const UPDATE_PSA_SEQUENCES = gql`
  mutation ($psaSequences: [PsaSequenceInput]!) @api(name: controlPanel) {
    updatePsaSequences(psaSequences: $psaSequences)
  }
`;

export const UPDATE_SEQUENCES = gql`
  mutation ($sequences: [SequenceInput]!) @api(name: controlPanel) {
    updateSequences(sequences: $sequences)
  }
`;

export const UPDATE_SEQUENCE_GROUPS = gql`
  mutation ($sequenceGroups: [SequenceGroupInput]!) @api(name: controlPanel) {
    updateSequenceGroups(sequenceGroups: $sequenceGroups)
  }
`;

export const UPDATE_SHOW = gql`
  mutation ($email: String!, $showName: String!) @api(name: controlPanel) {
    updateShow(email: $email, showName: $showName)
  }
`;

export const PLAY_SEQUENCE_FROM_CONTROL_PANEL = gql`
  mutation ($sequence: SequenceInput!) @api(name: controlPanel) {
    playSequenceFromControlPanel(sequence: $sequence)
  }
`;

export const DELETE_SINGLE_REQUEST = gql`
  mutation ($position: Int!) @api(name: controlPanel) {
    deleteSingleRequest(position: $position)
  }
`;

export const DELETE_ALL_REQUESTS = gql`
  mutation @api(name: controlPanel) {
    deleteAllRequests
  }
`;

export const RESET_ALL_VOTES = gql`
  mutation @api(name: controlPanel) {
    resetAllVotes
  }
`;
