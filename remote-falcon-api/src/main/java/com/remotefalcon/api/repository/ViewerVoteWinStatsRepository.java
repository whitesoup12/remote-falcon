package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.ViewerVoteWinStats;
import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;
import java.util.List;

public interface ViewerVoteWinStatsRepository extends JpaRepository<ViewerVoteWinStats, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<ViewerVoteWinStats> findAllByRemoteToken(String remoteToken);
  List<ViewerVoteWinStats> findAllByRemoteTokenAndVoteWinDateTimeBetween(String remoteToken, ZonedDateTime startDate, ZonedDateTime endDate);
  int countAllByRemoteTokenAndVoteWinDateTimeAfter(String remoteToken, ZonedDateTime yesterday);
  List<ViewerVoteWinStats> findAllByVoteWinDateTimeBefore(ZonedDateTime voteWinDateTime);
}
