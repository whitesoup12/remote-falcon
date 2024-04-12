import { gql } from '@apollo/client';

export const SIGN_IN = gql`
  query {
    signIn {
      serviceToken
    }
  }
`;

export const VERIFY_PASSWORD_RESET_LINK = gql`
  query ($passwordResetLink: String!) {
    verifyPasswordResetLink(passwordResetLink: $passwordResetLink) {
      serviceToken
    }
  }
`;

export const GET_SHOW = gql`
  query {
    getShow {
      showToken
      email
      showName
      showSubdomain
      emailVerified
      createdDate
      lastLoginDate
      expireDate
      pluginVersion
      fppVersion
      lastLoginIp
      showRole
      serviceToken
      apiAccess {
        apiAccessActive
      }
      userProfile {
        firstName
        lastName
        facebookUrl
        youtubeUrl
      }
      preferences {
        viewerControlEnabled
        viewerControlMode
        resetVotes
        jukeboxDepth
        locationCheckMethod
        showLatitude
        showLongitude
        allowedRadius
        checkIfVoted
        psaEnabled
        psaFrequency
        jukeboxRequestLimit
        jukeboxHistoryLimit
        locationCode
        hideSequenceCount
        makeItSnow
        managePsa
        sequencesPlayed
        pageTitle
        pageIconUrl
      }
      sequences {
        name
        displayName
        duration
        visible
        votes
        lastVoteTime
        totalVotes
        index
        order
        imageUrl
        active
        ownerVoted
        visibilityCount
        type
        group
        category
        artist
        total
      }
      psaSequences {
        name
        order
        lastPlayed
      }
      pages {
        name
        active
        html
      }
    }
  }
`;

export const DASHBOARD_LIVE_STATS = gql`
  query ($startDate: Long!, $endDate: Long!, $timezone: String) {
    dashboardLiveStats(startDate: $startDate, endDate: $endDate, timezone: $timezone) {
      activeViewers
      totalViewers
      currentRequests
      totalRequests
    }
  }
`;
export const DASHBOARD_STATS = gql`
  query ($startDate: Long!, $endDate: Long!, $timezone: String) {
    dashboardStats(startDate: $startDate, endDate: $endDate, timezone: $timezone) {
      page {
        date
        total
        unique
      }
      jukeboxByDate {
        date
        total
        sequences {
          name
          total
        }
      }
      jukeboxBySequence {
        sequences {
          name
          total
        }
      }
      votingByDate {
        date
        total
        sequences {
          name
          total
        }
      }
      votingBySequence {
        sequences {
          name
          total
        }
      }
      votingWinByDate {
        date
        total
        sequences {
          name
          total
        }
      }
      votingWinBySequence {
        sequences {
          name
          total
        }
      }
    }
  }
`;
