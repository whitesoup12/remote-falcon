package com.remotefalcon.controlpanel.response;

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
  private String viewerControlMode;
  private Boolean enableGeolocation;
  private Integer jukeboxDepth;
  private String remoteName;
  private Boolean enableLocationCode;
  private String locationCode;
  private Boolean makeItSnow;
}
