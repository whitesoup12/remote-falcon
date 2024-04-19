package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.RemoteViewerPages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RemoteViewerPagesRepository extends JpaRepository<RemoteViewerPages, Integer> {
  List<RemoteViewerPages> findAllByRemoteToken(String remoteToken);
  Optional<RemoteViewerPages> findFirstByRemoteTokenAndViewerPageName(String remoteToken, String viewerPageName);
  Optional<RemoteViewerPages> findByRemoteTokenAndRemoteViewerPageKey(String remoteToken, Long remoteViewerPageKey);
  Optional<RemoteViewerPages> findFirstByRemoteTokenAndViewerPageActive(String remoteToken, Boolean viewerPageActive);
}
