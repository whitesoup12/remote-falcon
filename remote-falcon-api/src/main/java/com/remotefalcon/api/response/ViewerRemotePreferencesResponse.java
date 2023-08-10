package com.remotefalcon.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViewerRemotePreferencesResponse {
  private Boolean viewerControlEnabled;
  private Boolean viewerModeEnabled;
  private String viewerControlMode;
  private Boolean enableGeolocation;
  private Integer messageDisplayTime;
  private Integer jukeboxDepth;
  private String remoteName;
  private Boolean enableLocationCode;
  private String locationCode;
  private Boolean makeItSnow;
}
