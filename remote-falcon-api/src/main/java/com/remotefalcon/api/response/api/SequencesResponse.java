package com.remotefalcon.api.response.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SequencesResponse {
  private String sequenceName;
  private String sequenceDisplayName;
  private Integer sequenceDuration;
  private Boolean sequenceVisible;
  private String sequenceImageUrl;
}
