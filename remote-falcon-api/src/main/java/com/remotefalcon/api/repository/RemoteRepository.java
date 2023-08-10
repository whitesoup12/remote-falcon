package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.Remote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface RemoteRepository extends JpaRepository<Remote, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  Remote findByEmailOrRemoteSubdomain(String email, String remoteSubdomain);
  Remote findByRemoteSubdomain(String remoteSubdomain);
  Remote findByRemoteTokenAndUserRole(String remoteToken, String userRole);
  Remote findByEmail(String email);
  Remote findByRemoteToken(String remoteToken);
  List<Remote> findAllByRemoteTokenIn(List<String> remoteToken);

  @Query(value = "SELECT " +
          "  A.*, " +
          "  (SELECT COUNT(C.viewerPage) " +
          "  FROM PAGE_GALLERY_HEARTS C " +
          "  WHERE C.viewerPageHearted = 'Y' " +
          "    AND A.remoteSubdomain = C.viewerPage " +
          "  GROUP BY viewerPage) AS viewerPageHeartCount " +
          "FROM " +
          "  REMOTES A, " +
          "  REMOTE_PREFS B " +
          "WHERE B.viewerPagePublic = 'Y' " +
          "  AND B.remoteToken = A.remoteToken " +
          "ORDER BY " +
          "  viewerPageHeartCount DESC, " +
          "  A.remoteSubdomain ASC " +
          "LIMIT :page,8", nativeQuery = true)
  List<Remote> findAllByViewerPagePublic(Integer page);
}
