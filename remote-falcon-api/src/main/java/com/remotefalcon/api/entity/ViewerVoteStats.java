package com.remotefalcon.api.entity;

import com.remotefalcon.api.model.ViewerVoteStatsSequenceVotes;
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
