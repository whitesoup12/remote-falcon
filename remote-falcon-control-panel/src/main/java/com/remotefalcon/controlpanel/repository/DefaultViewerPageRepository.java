package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.DefaultViewerPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DefaultViewerPageRepository extends JpaRepository<DefaultViewerPage, Integer> {
  DefaultViewerPage findFirstByIsVersionActive(Boolean isVersionActive);
}
