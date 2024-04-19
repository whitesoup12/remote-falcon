package com.remotefalcon.controlpanel.response.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CurrentlyPlayingResponse {
  private String currentSequence;
}
