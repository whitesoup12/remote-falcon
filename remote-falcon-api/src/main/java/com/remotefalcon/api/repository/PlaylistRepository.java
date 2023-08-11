package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.ActiveViewer;
import com.remotefalcon.api.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<Playlist> findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceOrderAsc(String remoteToken, Boolean sequenceActive);
  List<Playlist> findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceKeyAsc(String remoteToken, Boolean sequenceActive);
  List<Playlist> findAllByRemoteTokenOrderBySequenceOrderAsc(String remoteToken);
  List<Playlist> findAllByRemoteToken(String remoteToken);
  List<Playlist> findAllByRemoteTokenAndIsSequenceActive(String remoteToken, Boolean isSequenceActive);
  Playlist findByRemoteTokenAndSequenceKey(String remoteToken, Long sequenceKey);
  Optional<Playlist> findFirstByRemoteTokenAndSequenceName(String remoteToken, String sequenceName);
  Optional<Playlist> findFirstByRemoteTokenAndSequenceGroup(String remoteToken, String sequenceGroup);
  List<Playlist> findAllByRemoteTokenAndSequenceGroupOrderBySequenceOrderAsc(String remoteToken, String sequenceGroup);
  List<Playlist> findAllByRemoteTokenAndSequenceGroupOrderBySequenceOrderDesc(String remoteToken, String sequenceGroup);
  List<Playlist> findAllByRemoteTokenAndOwnerVoted(String remoteToken, Boolean ownerVoted);
  List<Playlist> findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(String remoteToken, Boolean isSequenceActive);
  List<Playlist> findAllByRemoteTokenAndSequenceNameIn(String remoteToken, List<String> sequenceName);
}
