import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation ($firstName: String, $lastName: String, $showName: String!) {
    signUp(firstName: $firstName, lastName: $lastName, showName: $showName)
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const VERIFY_EMAIL = gql`
  mutation ($showToken: String!) {
    verifyEmail(showToken: $showToken)
  }
`;

export const RESET_PASSWORD = gql`
  mutation {
    resetPassword
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation {
    updatePassword
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation ($userProfile: UserProfileInput!) {
    updateUserProfile(userProfile: $userProfile)
  }
`;

export const REQUEST_API_ACCESS = gql`
  mutation {
    requestApiAccess
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation {
    deleteAccount
  }
`;

export const UPDATE_PAGES = gql`
  mutation ($pages: [PageInput]!) {
    updatePages(pages: $pages)
  }
`;

export const UPDATE_PREFERENCES = gql`
  mutation ($preferences: PreferenceInput!) {
    updatePreferences(preferences: $preferences)
  }
`;

export const UPDATE_PSA_SEQUENCES = gql`
  mutation ($psaSequences: [PsaSequenceInput]!) {
    updatePsaSequences(psaSequences: $psaSequences)
  }
`;

export const UPDATE_SEQUENCES = gql`
  mutation ($sequences: [SequenceInput]!) {
    updateSequences(sequences: $sequences)
  }
`;

export const UPDATE_SEQUENCE_GROUPS = gql`
  mutation ($sequenceGroups: [SequenceGroupInput]!) {
    updateSequenceGroups(sequenceGroups: $sequenceGroups)
  }
`;

export const UPDATE_SHOW = gql`
  mutation ($email: String!, $showName: String!) {
    updateShow(email: $email, showName: $showName)
  }
`;

export const PLAY_SEQUENCE_FROM_CONTROL_PANEL = gql`
  mutation ($sequence: SequenceInput!) {
    playSequenceFromControlPanel(sequence: $sequence)
  }
`;
