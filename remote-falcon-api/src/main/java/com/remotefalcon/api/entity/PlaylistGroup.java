package com.remotefalcon.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.ZonedDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PLAYLIST_GROUPS")
public class PlaylistGroup {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "playlistGroupKey")
  private Long sequenceGroupKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "playlistGroupName")
  private String sequenceGroupName;

  @Column(name = "playlistGroupVotes")
  private Integer sequenceGroupVotes;

  @Column(name = "playlistGroupVoteTime")
  private ZonedDateTime sequenceGroupVoteTime;

  @Column(name = "playlistGroupVotesTotal")
  private Integer sequenceGroupVotesTotal;

  @Column(name = "playlistsInGroup")
  private Integer sequencesInGroup;

  @Column(name = "sequenceGroupVisibleCount")
  private Integer sequenceGroupVisibleCount;

  @Transient
  List<String> sequenceNamesInGroup;
}
