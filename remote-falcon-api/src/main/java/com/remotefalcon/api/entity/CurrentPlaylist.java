package com.remotefalcon.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "CURRENT_PLAYLIST")
public class CurrentPlaylist {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "currentPlaylistKey")
  private Long currentPlaylistKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "currentPlaylist")
  private String currentPlaylist;
}
