package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.ActiveViewer;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;

@Repository
public interface ActiveViewerRepository extends JpaRepository<ActiveViewer, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);

  List<ActiveViewer> findAllByRemoteToken(String remoteToken);

  @Lock(LockModeType.PESSIMISTIC_READ)
  @Transactional
  ActiveViewer findFirstByRemoteTokenAndViewerIp(String remoteToken, String viewerIp);
}
