package com.remotefalcon.controlpanel.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "REMOTE_PREFS")
public class RemotePreference {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "remotePrefToken")
  private Long remotePrefToken;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "viewerModeEnabled")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean viewerModeEnabled;

  @Column(name = "viewerControlEnabled")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean viewerControlEnabled;

  @Column(name = "viewerControlMode")
  private String viewerControlMode;

  @Column(name = "resetVotes")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean resetVotes;

  @Column(name = "jukeboxDepth")
  private Integer jukeboxDepth;

  @Column(name = "enableGeolocation")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean enableGeolocation;

  @Column(name = "remoteLatitude")
  private Float remoteLatitude;

  @Column(name = "remoteLongitude")
  private Float remoteLongitude;

  @Column(name = "allowedRadius")
  private Float allowedRadius;

  @Column(name = "messageDisplayTime")
  private Integer messageDisplayTime;

  @Column(name = "checkIfVoted")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean checkIfVoted;

  @Column(name = "interruptSchedule")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean interruptSchedule;

  @Column(name = "psaEnabled")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean psaEnabled;

  @Column(name = "psaSequence")
  private String psaSequence;

  @Column(name = "psaFrequency")
  private Integer psaFrequency;

  @Column(name = "jukeboxRequestLimit")
  private Integer jukeboxRequestLimit;

  @Column(name = "viewerPagePublic")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean viewerPagePublic;

  @Column(name = "jukeboxHistoryLimit")
  private Integer jukeboxHistoryLimit;

  @Column(name = "enableLocationCode")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean enableLocationCode;

  @Column(name = "locationCode")
  private String locationCode;

  @Column(name = "apiAccessRequested")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean apiAccessRequested;

  @Column(name = "autoSwitchControlModeSize")
  private Integer autoSwitchControlModeSize;

  @Column(name = "autoSwitchControlModeToggled")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean autoSwitchControlModeToggled;

  @Column(name = "hideSequenceCount")
  private Integer hideSequenceCount;

  @Column(name = "makeItSnow")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean makeItSnow;

  @Column(name = "managePsa")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean managePsa;

  @Column(name = "sequencesPlayed")
  private Integer sequencesPlayed;

  @Transient
  List<PsaSequenceOld> psaSequenceOldList;

  @Transient
  List<String> remoteViewerPages;

  @Transient
  String activeRemoteViewerPage;
}
