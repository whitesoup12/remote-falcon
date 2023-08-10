package com.remotefalcon.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ACTIVE_VIEWER")
public class ActiveViewer {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "activeViewerKey")
  private Long activeViewerKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "viewerIp")
  private String viewerIp;

  @Column(name = "lastUpdateDateTime")
  private ZonedDateTime lastUpdateDateTime;
}
