package com.remotefalcon.controlpanel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SyncPlaylistDetails {
  private String playlistName;
  private Integer playlistDuration;
  private Integer playlistIndex;
  private String playlistType;
}
