package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.RemoteViewerPageTemplates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemoteViewerPageTemplatesRepository extends JpaRepository<RemoteViewerPageTemplates, Integer> {
  List<RemoteViewerPageTemplates> findAllByIsActive(Boolean isActive);
}
