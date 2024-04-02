import { gql } from '@apollo/client';

export const signUpQql = gql`
  mutation ($firstName: String!, $lastName: String!, $showName: String!) {
    signUp(firstName: $firstName, lastName: $lastName, showName: $showName) {
      firstName
      lastName
      showName
    }
  }
`;

export const verifyEmailQql = gql`
  mutation ($showToken: String!) {
    verifyEmail(showToken: $showToken)
  }
`;

export const signInQql = gql`
  query {
    signIn {
      serviceToken
    }
  }
`;

export const coreInfoQql = gql`
  query {
    coreInfo {
      showToken
      email
      showName
      showSubdomain
      firstName
      lastName
      createdDate
      pluginVersion
      fppVersion
      facebookUrl
      youtubeUrl
      userRole
      apiAccessActive
      preference {
        viewerControlMode
      }
    }
  }
`;

export const forgotPasswordGql = gql`
  mutation ($email: String!) {
    forgotPassword(email: $email)
  }
`;

export const verifyPasswordResetLinkQql = gql`
  query ($passwordResetLink: String!) {
    verifyPasswordResetLink(passwordResetLink: $passwordResetLink) {
      serviceToken
    }
  }
`;

export const resetPasswordGql = gql`
  mutation {
    resetPassword
  }
`;
