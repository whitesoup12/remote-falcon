package com.remotefalcon.api.entity;

import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PLAYLISTS")
public class Playlist {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "playlistKey")
  private Long sequenceKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "playlistName")
  private String sequenceName;

  @Column(name = "playlistPrettyName")
  private String sequenceDisplayName;

  @Column(name = "playlistDuration")
  private Integer sequenceDuration;

  @Column(name = "playlistVisible")
  @Type(type = "yes_no")
  private Boolean sequenceVisible;

  @Column(name = "playlistVotes")
  private Integer sequenceVotes;

  @Column(name = "playlistVoteTime")
  private ZonedDateTime sequenceVoteTime;

  @Column(name = "playlistVotesTotal")
  private Integer sequenceVotesTotal;

  @Column(name = "playlistIndex")
  private Integer sequenceIndex;

  @Column(name = "playlistOrder")
  private Integer sequenceOrder;

  @Column(name = "playlistImageUrl")
  private String sequenceImageUrl;

  @Column(name = "isPlaylistActive")
  @Type(type = "yes_no")
  private Boolean isSequenceActive;

  @Column(name = "ownerVoted")
  @Type(type = "yes_no")
  private Boolean ownerVoted;

  @Column(name = "sequenceVisibleCount")
  private Integer sequenceVisibleCount;

  @Column(name = "playlistType")
  private String sequenceType;

  @Column(name = "playlistGroupName")
  private String sequenceGroup;
}
