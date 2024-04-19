package com.remotefalcon.controlpanel.entity;

import com.remotefalcon.controlpanel.model.ViewerJukeStatsSequenceRequests;
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
import jakarta.persistence.Transient;
import java.time.ZonedDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "VIEWER_JUKE_STATS")
public class ViewerJukeStats {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "viewerJukeStatKey")
  private Long viewerJukeStatKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "playlistName")
  private String playlistName;

  @Column(name = "requestDateTime")
  private ZonedDateTime requestDateTime;

  @Transient
  private Long requestDate;
  @Transient
  private Integer totalRequests;
  @Transient
  private List<ViewerJukeStatsSequenceRequests> sequenceRequests;
}
