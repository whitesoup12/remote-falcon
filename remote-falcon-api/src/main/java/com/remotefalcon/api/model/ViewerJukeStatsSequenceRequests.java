package com.remotefalcon.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViewerJukeStatsSequenceRequests {
  private String sequenceName;
  private Integer sequenceRequests;
}
