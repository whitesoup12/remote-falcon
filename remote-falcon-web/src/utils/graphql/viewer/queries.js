import { gql } from '@apollo/client';

export const GET_SHOW = gql`
  query @api(name: viewer) {
    getShow {
      showSubdomain
      playingNow
      playingNext
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
      pages {
        name
        active
        html
      }
      requests {
        sequence {
          name
          displayName
        }
        position
        ownerRequested
      }
      votes {
        sequence {
          name
          displayName
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

export const ACTIVE_VIEWER_PAGE = gql`
  query @api(name: viewer) {
    activeViewerPage
  }
`;
