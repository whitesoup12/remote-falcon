package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.PageGalleryHearts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;

@Repository
public interface PageGalleryHeartsRepository extends JpaRepository<PageGalleryHearts, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<PageGalleryHearts> findAllByViewerPageHeartedTrue();
  List<PageGalleryHearts> findAllByRemoteTokenAndViewerPageHeartedTrue(String remoteToken);
  PageGalleryHearts findByRemoteTokenAndViewerPage(String remoteToken, String viewerPage);
}
