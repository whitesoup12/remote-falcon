package com.remotefalcon.controlpanel.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddSequenceRequest {
  private Float viewerLatitude;
  private Float viewerLongitude;
  private String timezone;
  private ZonedDateTime date;
  private String sequence;
}
