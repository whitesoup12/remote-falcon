package com.remotefalcon.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardRequest {
  private String timezone;
  private ZonedDateTime startDate;
  private ZonedDateTime endDate;
  private Long startDateMillis;
  private Long endDateMillis;
}
