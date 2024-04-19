package com.remotefalcon.controlpanel.response;

import com.remotefalcon.controlpanel.model.GitHubLabel;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GitHubIssueResponse {
  private Integer number;
  private String title;
  private String state;
  private ZonedDateTime created_at;
  private String body;
  private Integer comments;
  private String html_url;
  private List<GitHubLabel> labels;

  @Transient
  private String type;
}
