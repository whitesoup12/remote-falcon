package com.remotefalcon.controlpanel.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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
