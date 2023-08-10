package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.RemotePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface RemotePreferenceRepository extends JpaRepository<RemotePreference, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  RemotePreference findByRemoteToken(String remoteToken);
  Integer countByViewerPagePublicTrue();
}
