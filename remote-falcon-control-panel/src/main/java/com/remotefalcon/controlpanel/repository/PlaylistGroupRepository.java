package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.PlaylistGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistGroupRepository extends JpaRepository<PlaylistGroup, Integer> {
  List<PlaylistGroup> findAllByRemoteToken(String remoteToken);
  Optional<PlaylistGroup> findBySequenceGroupKey(Long sequenceGroupKey);
  Optional<PlaylistGroup> findByRemoteTokenAndSequenceGroupName(String remoteToken, String sequenceGroupName);
  Optional<PlaylistGroup> findFirstByRemoteTokenAndSequenceGroupName(String remoteToken, String sequenceGroupName);
  List<PlaylistGroup> findAllByRemoteTokenOrderBySequenceGroupVotesDesc(String remoteToken);
}
