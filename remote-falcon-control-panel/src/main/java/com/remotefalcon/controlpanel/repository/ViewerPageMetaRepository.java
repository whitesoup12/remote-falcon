package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.ViewerPageMeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface ViewerPageMetaRepository extends JpaRepository<ViewerPageMeta, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  ViewerPageMeta findByRemoteToken(String remoteToken);
}
