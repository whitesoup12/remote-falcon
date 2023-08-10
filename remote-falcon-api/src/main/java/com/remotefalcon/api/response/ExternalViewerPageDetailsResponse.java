package com.remotefalcon.api.response;

import com.remotefalcon.api.entity.Playlist;
import com.remotefalcon.api.entity.ViewerPageMeta;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExternalViewerPageDetailsResponse {
  private ViewerRemotePreferencesResponse remotePreferences;
  private List<Playlist> sequences;
  private String whatsPlaying;
  private String nextSequence;
  private Integer queueDepth;
  private List<String> jukeboxRequests;
  private ViewerPageMeta viewerPageMeta;
}
