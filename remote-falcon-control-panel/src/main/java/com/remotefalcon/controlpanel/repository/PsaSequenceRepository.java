package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.PsaSequenceOld;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface PsaSequenceRepository extends JpaRepository<PsaSequenceOld, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<PsaSequenceOld> findAllByRemoteToken(String remoteToken);
  List<PsaSequenceOld> findAllByRemoteTokenOrderByPsaSequenceOrderAsc(String remoteToken);
  Optional<PsaSequenceOld> findFirstByRemoteTokenOrderByPsaSequenceLastPlayedAscPsaSequenceOrderAsc(String remoteToken);
}
