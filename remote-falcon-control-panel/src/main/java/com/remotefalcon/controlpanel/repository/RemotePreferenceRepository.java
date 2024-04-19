package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.RemotePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface RemotePreferenceRepository extends JpaRepository<RemotePreference, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  RemotePreference findByRemoteToken(String remoteToken);
  Integer countByViewerPagePublicTrue();
}
