import { gql } from '@apollo/client';

export const SIGN_IN = gql`
  query @api(name: controlPanel) {
    signIn {
      serviceToken
    }
  }
`;

export const VERIFY_PASSWORD_RESET_LINK = gql`
  query ($passwordResetLink: String!) @api(name: controlPanel) {
    verifyPasswordResetLink(passwordResetLink: $passwordResetLink) {
      serviceToken
    }
  }
`;

export const GET_SHOW = gql`
  query @api(name: controlPanel) {
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
      playingNow
      playingNext
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
        key
        displayName
        duration
        visible
        index
        order
        imageUrl
        active
        visibilityCount
        type
        group
        category
        artist
      }
      sequenceGroups {
        name
        visibilityCount
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
      requests {
        sequence {
          name
        }
        position
        ownerRequested
      }
      votes {
        sequence {
          name
        }
        votes
        lastVoteTime
        ownerVoted
      }
      activeViewers {
        ipAddress
        visitDateTime
      }
    }
  }
`;

export const DASHBOARD_LIVE_STATS = gql`
  query ($startDate: Long!, $endDate: Long!, $timezone: String) @api(name: controlPanel) {
    dashboardLiveStats(startDate: $startDate, endDate: $endDate, timezone: $timezone) {
      activeViewers
      totalViewers
      currentRequests
      totalRequests
      currentVotes
      totalVotes
    }
  }
`;
export const DASHBOARD_STATS = gql`
  query ($startDate: Long!, $endDate: Long!, $timezone: String) @api(name: controlPanel) {
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
