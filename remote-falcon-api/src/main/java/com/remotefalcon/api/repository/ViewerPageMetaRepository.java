package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.Playlist;
import com.remotefalcon.api.entity.ViewerPageMeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;

@Repository
public interface ViewerPageMetaRepository extends JpaRepository<ViewerPageMeta, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  ViewerPageMeta findByRemoteToken(String remoteToken);
}
