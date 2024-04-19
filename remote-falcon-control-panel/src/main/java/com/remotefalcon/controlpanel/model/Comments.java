package com.remotefalcon.controlpanel.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comments {
  private String text;
  private String createdBy;
  private ZonedDateTime createdDate;
}
