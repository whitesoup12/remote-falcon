import { gql } from '@apollo/client';

export const dashboardStatsQql = gql`
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

export const dashboardLiveStatsQql = gql`
  query ($startDate: Long!, $endDate: Long!, $timezone: String) {
    dashboardLiveStats(startDate: $startDate, endDate: $endDate, timezone: $timezone) {
      activeViewers
      totalViewers
      currentRequests
      totalRequests
    }
  }
`;
