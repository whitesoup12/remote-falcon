package com.remotefalcon.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {
  private String firstName;
  private String lastName;
  private String remoteName;
  private String facebookUrl;
  private String youtubeUrl;
}
