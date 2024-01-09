package com.remotefalcon.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViewerTokenDTO {
  private String showSubdomain;
  private String showToken;
}
