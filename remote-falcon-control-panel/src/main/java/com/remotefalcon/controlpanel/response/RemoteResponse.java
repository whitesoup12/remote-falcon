package com.remotefalcon.controlpanel.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RemoteResponse {
  private Long remoteKey;
  private String remoteToken;
  private String email;
  private String remoteName;
  private String remoteSubdomain;
  private Boolean emailVerified;
  private String activeTheme;
  private String status;
  private String serviceToken;
  private String firstName;
  private String lastName;
  private String facebookUrl;
  private String youtubeUrl;
  private String viewerControlMode;
  private String userRole;
}
