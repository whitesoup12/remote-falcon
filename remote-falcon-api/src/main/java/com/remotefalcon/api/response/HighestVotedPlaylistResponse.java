package com.remotefalcon.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HighestVotedPlaylistResponse {
  private String winningPlaylist;
  private Integer playlistIndex;
}
