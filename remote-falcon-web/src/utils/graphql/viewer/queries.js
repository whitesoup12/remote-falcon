import { gql } from '@apollo/client';

export const GET_SHOW = gql`
  query @api(name: viewer) {
    getShow {
      showSubdomain
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
        key
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
      sequenceGroups {
        name
        votes
        lastVoteTime
        totalVotes
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
    }
  }
`;

export const ACTIVE_VIEWER_PAGE = gql`
  query @api(name: viewer) {
    activeViewerPage
  }
`;
