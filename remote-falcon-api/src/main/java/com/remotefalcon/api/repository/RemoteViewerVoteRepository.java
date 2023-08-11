package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.Playlist;
import com.remotefalcon.api.entity.RemoteViewerVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface RemoteViewerVoteRepository extends JpaRepository<RemoteViewerVote, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<RemoteViewerVote> findAllByRemoteToken(String remoteToken);
  Optional<RemoteViewerVote> findByRemoteTokenAndViewerIp(String remoteToken, String viewerIp);
}
