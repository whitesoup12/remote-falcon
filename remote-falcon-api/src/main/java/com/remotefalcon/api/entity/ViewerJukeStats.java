package com.remotefalcon.api.entity;

import com.remotefalcon.api.model.ViewerJukeStatsSequenceRequests;
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
import javax.persistence.Transient;
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
