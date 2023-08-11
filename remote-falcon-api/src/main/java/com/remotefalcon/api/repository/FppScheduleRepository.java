package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.FppSchedule;
import com.remotefalcon.api.entity.RemoteJuke;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface FppScheduleRepository extends JpaRepository<FppSchedule, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  @Transactional
  void deleteByRemoteToken(String remoteToken);
  Optional<FppSchedule> findByRemoteToken(String remoteToken);
}
