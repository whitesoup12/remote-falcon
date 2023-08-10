package com.remotefalcon.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PluginResponse {
  private String message;
  private String currentPlaylist;
  private String nextScheduledSequence;
  private String viewerControlMode;
  private Boolean viewerControlEnabled;
}
