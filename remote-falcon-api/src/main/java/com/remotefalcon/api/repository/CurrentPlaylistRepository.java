package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.CurrentPlaylist;
import com.remotefalcon.api.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface CurrentPlaylistRepository extends JpaRepository<CurrentPlaylist, Integer> {
  @Transactional
  void deleteAllByRemoteToken(String remoteToken);
  @Transactional
  void deleteByRemoteToken(String remoteToken);
  Optional<CurrentPlaylist> findByRemoteToken(String remoteToken);
}
