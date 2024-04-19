package com.remotefalcon.controlpanel.entity;

import com.remotefalcon.controlpanel.model.ViewerVoteWinStatsSequenceWins;
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
