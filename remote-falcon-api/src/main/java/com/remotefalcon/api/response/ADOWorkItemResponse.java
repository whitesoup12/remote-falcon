package com.remotefalcon.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ADOWorkItemResponse {
  private Integer id;
  private String type;
  private String state;
  private ZonedDateTime createdDate;
  private String requestedBy;
  private String title;
  private String description;
  private String severity;
  private Integer commentCount;
}
