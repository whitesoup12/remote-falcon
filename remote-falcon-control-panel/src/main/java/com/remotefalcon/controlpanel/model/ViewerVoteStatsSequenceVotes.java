package com.remotefalcon.controlpanel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ViewerVoteStatsSequenceVotes {
  private String sequenceName;
  private Integer sequenceVotes;
}
