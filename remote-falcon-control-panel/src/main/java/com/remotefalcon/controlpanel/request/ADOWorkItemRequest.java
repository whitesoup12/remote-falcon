package com.remotefalcon.controlpanel.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ADOWorkItemRequest {
  private String type;
  private String title;
  private String description;
  private String state;
  private String severity;
}
