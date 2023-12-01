package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.FppSchedule;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FppScheduleRepository extends JpaRepository<FppSchedule, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  @Transactional
  void deleteByRemoteToken(String remoteToken);
  Optional<FppSchedule> findByRemoteToken(String remoteToken);
  Optional<FppSchedule> findFirstByRemoteToken(String remoteToken);
}
