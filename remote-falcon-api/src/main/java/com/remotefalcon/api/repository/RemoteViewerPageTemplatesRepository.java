package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.RemoteViewerPageTemplates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemoteViewerPageTemplatesRepository extends JpaRepository<RemoteViewerPageTemplates, Integer> {
  List<RemoteViewerPageTemplates> findAllByIsActive(Boolean isActive);
}
