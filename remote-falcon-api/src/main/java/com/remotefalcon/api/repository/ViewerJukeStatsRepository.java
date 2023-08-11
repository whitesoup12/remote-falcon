package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.ViewerJukeStats;
import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;
import java.util.List;

public interface ViewerJukeStatsRepository extends JpaRepository<ViewerJukeStats, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<ViewerJukeStats> findAllByRemoteToken(String remoteToken);
  List<ViewerJukeStats> findAllByRemoteTokenAndRequestDateTimeBetween(String remoteToken, ZonedDateTime startDate, ZonedDateTime endDate);
  Integer countAllByRemoteTokenAndRequestDateTimeAfter(String remoteToken, ZonedDateTime yesterday);
  List<ViewerJukeStats> findAllByRequestDateTimeBefore(ZonedDateTime requestDateTime);
}
