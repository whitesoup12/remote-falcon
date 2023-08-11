package com.remotefalcon.api.entity;

import lombok.*;
import org.hibernate.annotations.Type;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "REMOTE_VIEWER_VOTES")
public class RemoteViewerVote {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "remoteViewerVoteKey")
  private Long remoteViewerVoteKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "viewerIp")
  private String viewerIp;
}
