package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.ActiveViewer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;

@Repository
public interface ActiveViewerRepository extends JpaRepository<ActiveViewer, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<ActiveViewer> findAllByRemoteToken(String remoteToken);
  ActiveViewer findFirstByRemoteTokenAndViewerIp(String remoteToken, String viewerIp);
}
