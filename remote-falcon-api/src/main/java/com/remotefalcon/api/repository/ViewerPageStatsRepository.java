package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.ViewerPageStats;
import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;
import java.util.List;

public interface ViewerPageStatsRepository extends JpaRepository<ViewerPageStats, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<ViewerPageStats> findAllByRemoteTokenAndPageVisitDateTimeBetween(String remoteToken, ZonedDateTime startDate, ZonedDateTime endDate);
  List<ViewerPageStats> findAllByPageVisitDateTimeBefore(ZonedDateTime pageVisitDateTime);
}
