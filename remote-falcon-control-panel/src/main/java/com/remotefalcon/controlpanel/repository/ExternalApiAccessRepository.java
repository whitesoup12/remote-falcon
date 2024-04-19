package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.ExternalApiAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.Optional;

@Repository
public interface ExternalApiAccessRepository extends JpaRepository<ExternalApiAccess, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  ExternalApiAccess findByRemoteToken(String remoteToken);
  Optional<ExternalApiAccess> findByAccessToken(String accessToken);
}
