package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.time.ZonedDateTime;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  @Transactional
  void deleteByEmail(String email);
  PasswordReset findByRemoteToken(String remoteToken);
  PasswordReset findByPasswordResetLinkAndPasswordResetExpiryGreaterThan(String passwordResetLink, ZonedDateTime passwordResetExpiry);
}
