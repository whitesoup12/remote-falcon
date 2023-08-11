package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.ActiveViewer;
import com.remotefalcon.api.entity.RemoteJuke;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface RemoteJukeRepository extends JpaRepository<RemoteJuke, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  @Transactional
  void deleteByRemoteToken(String remoteToken);
  Optional<RemoteJuke> findByRemoteJukeKey(Long remoteJukeKey);
  List<RemoteJuke> findAllByRemoteToken(String remoteToken);
  List<RemoteJuke> findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(String remoteToken);
  List<RemoteJuke> findAllByRemoteTokenAndOwnerRequested(String remoteToken, Boolean ownerRequested);
}
