package com.remotefalcon.controlpanel.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NextPlaylistResponse {
  private String nextPlaylist;
  private Integer playlistIndex;
  private Boolean updateQueue;
}
