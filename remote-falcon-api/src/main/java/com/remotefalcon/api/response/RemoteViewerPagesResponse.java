package com.remotefalcon.api.response;

import com.remotefalcon.api.entity.RemoteViewerPages;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RemoteViewerPagesResponse {
  private List<String> viewerPageNames;
  private RemoteViewerPages activeRemoteViewerPage;
}
