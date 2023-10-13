package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.RemoteViewerVote;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RemoteViewerVoteRepository extends JpaRepository<RemoteViewerVote, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<RemoteViewerVote> findAllByRemoteToken(String remoteToken);
  Optional<RemoteViewerVote> findFirstByRemoteTokenAndViewerIp(String remoteToken, String viewerIp);
}
