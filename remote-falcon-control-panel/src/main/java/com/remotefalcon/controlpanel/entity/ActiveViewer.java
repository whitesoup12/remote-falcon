package com.remotefalcon.controlpanel.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
