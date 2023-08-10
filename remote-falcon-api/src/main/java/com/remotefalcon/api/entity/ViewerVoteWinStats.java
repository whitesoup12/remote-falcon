package com.remotefalcon.api.entity;

import com.remotefalcon.api.model.ViewerVoteWinStatsSequenceWins;
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
@Table(name = "VIEWER_VOTE_WIN_STATS")
public class ViewerVoteWinStats {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "viewerVoteWinStatKey")
  private Long viewerVoteWinStatKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "playlistName")
  private String playlistName;

  @Column(name = "voteWinDateTime")
  private ZonedDateTime voteWinDateTime;

  @Column(name = "totalVotes")
  private Integer totalVotes;

  @Transient
  private Long voteDate;
  @Transient
  private List<ViewerVoteWinStatsSequenceWins> sequenceWins;
}
