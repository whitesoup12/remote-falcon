package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.ViewerVoteStats;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
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
