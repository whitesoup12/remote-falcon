package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.PageGalleryHearts;
import com.remotefalcon.api.entity.RemoteJuke;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

@Repository
public interface PageGalleryHeartsRepository extends JpaRepository<PageGalleryHearts, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  List<PageGalleryHearts> findAllByViewerPageHeartedTrue();
  List<PageGalleryHearts> findAllByRemoteTokenAndViewerPageHeartedTrue(String remoteToken);
  PageGalleryHearts findByRemoteTokenAndViewerPage(String remoteToken, String viewerPage);
}
