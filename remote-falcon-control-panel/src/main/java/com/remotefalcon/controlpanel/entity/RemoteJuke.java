package com.remotefalcon.controlpanel.entity;

import lombok.*;

import jakarta.persistence.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "REMOTE_JUKE")
public class RemoteJuke {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "remoteJukeKey")
  private Long remoteJukeKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "nextPlaylist")
  private String nextPlaylist;

  @Column(name = "futurePlaylist")
  private String futurePlaylist;

  @Column(name = "futurePlaylistSequence")
  private Integer futurePlaylistSequence;

  @Column(name = "ownerRequested")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean ownerRequested;

  @Transient
  private String sequence;
}
