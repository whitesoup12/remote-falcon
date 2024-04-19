package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.ViewerVoteStats;
import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;
import java.util.List;

public interface ViewerVoteStatsRepository extends JpaRepository<ViewerVoteStats, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<ViewerVoteStats> findAllByRemoteToken(String remoteToken);
  List<ViewerVoteStats> findAllByRemoteTokenAndVoteDateTimeBetween(String remoteToken, ZonedDateTime startDate, ZonedDateTime endDate);
  Integer countAllByRemoteTokenAndVoteDateTimeAfter(String remoteToken, ZonedDateTime yesterday);
  List<ViewerVoteStats> findAllByVoteDateTimeBefore(ZonedDateTime voteDateTime);
}
