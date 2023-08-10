package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.PsaSequence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface PsaSequenceRepository extends JpaRepository<PsaSequence, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<PsaSequence> findAllByRemoteToken(String remoteToken);
  List<PsaSequence> findAllByRemoteTokenOrderByPsaSequenceOrderAsc(String remoteToken);
  Optional<PsaSequence> findFirstByRemoteTokenOrderByPsaSequenceLastPlayedAscPsaSequenceOrderAsc(String remoteToken);
}
