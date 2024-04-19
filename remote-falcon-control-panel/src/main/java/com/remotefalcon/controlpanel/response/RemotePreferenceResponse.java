package com.remotefalcon.controlpanel.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RemotePreferenceResponse {
  private String viewerControlMode;
  private String remoteSubdomain;
  private Boolean interruptSchedule;
}
