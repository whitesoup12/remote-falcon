package com.remotefalcon.controlpanel.response.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PreferencesResponse {
  private Boolean viewerControlEnabled;
  private String viewerControlMode;
  private Boolean enableGeolocation;
  private Integer messageDisplayTime;
  private Integer jukeboxDepth;
  private String showName;
  private Boolean enableLocationCode;
  private String locationCode;
}
