package com.remotefalcon.api.entity;

import com.remotefalcon.api.model.ViewerVoteStatsSequenceVotes;
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
@Table(name = "VIEWER_VOTE_STATS")
public class ViewerVoteStats {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "viewerVoteStatKey")
  private Long viewerVoteStatKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "playlistName")
  private String playlistName;

  @Column(name = "voteDateTime")
  private ZonedDateTime voteDateTime;

  @Transient
  private Long voteDate;
  @Transient
  private Integer totalVotes;
  @Transient
  private List<ViewerVoteStatsSequenceVotes> sequenceVotes;
}
