package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.DefaultViewerPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DefaultViewerPageRepository extends JpaRepository<DefaultViewerPage, Integer> {
  DefaultViewerPage findFirstByIsVersionActive(Boolean isVersionActive);
}
