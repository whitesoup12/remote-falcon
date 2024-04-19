package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationsRepository extends JpaRepository<Notifications, Integer> {
  @Transactional
  void deleteByNotificationKey(Long notificationKey);
  List<Notifications> findAllByRemoteToken(String remoteToken);
  Optional<Notifications> findByNotificationKey(Long notificationKey);
}
