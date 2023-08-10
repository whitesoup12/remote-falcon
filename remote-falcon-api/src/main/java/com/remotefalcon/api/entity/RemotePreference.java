package com.remotefalcon.api.entity;

import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;
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
  @Type(type = "yes_no")
  private Boolean viewerModeEnabled;

  @Column(name = "viewerControlEnabled")
  @Type(type = "yes_no")
  private Boolean viewerControlEnabled;

  @Column(name = "viewerControlMode")
  private String viewerControlMode;

  @Column(name = "resetVotes")
  @Type(type = "yes_no")
  private Boolean resetVotes;

  @Column(name = "jukeboxDepth")
  private Integer jukeboxDepth;

  @Column(name = "enableGeolocation")
  @Type(type = "yes_no")
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
  @Type(type = "yes_no")
  private Boolean checkIfVoted;

  @Column(name = "interruptSchedule")
  @Type(type = "yes_no")
  private Boolean interruptSchedule;

  @Column(name = "psaEnabled")
  @Type(type = "yes_no")
  private Boolean psaEnabled;

  @Column(name = "psaSequence")
  private String psaSequence;

  @Column(name = "psaFrequency")
  private Integer psaFrequency;

  @Column(name = "jukeboxRequestLimit")
  private Integer jukeboxRequestLimit;

  @Column(name = "viewerPagePublic")
  @Type(type = "yes_no")
  private Boolean viewerPagePublic;

  @Column(name = "jukeboxHistoryLimit")
  private Integer jukeboxHistoryLimit;

  @Column(name = "enableLocationCode")
  @Type(type = "yes_no")
  private Boolean enableLocationCode;

  @Column(name = "locationCode")
  private String locationCode;

  @Column(name = "apiAccessRequested")
  @Type(type = "yes_no")
  private Boolean apiAccessRequested;

  @Column(name = "autoSwitchControlModeSize")
  private Integer autoSwitchControlModeSize;

  @Column(name = "autoSwitchControlModeToggled")
  @Type(type = "yes_no")
  private Boolean autoSwitchControlModeToggled;

  @Column(name = "hideSequenceCount")
  private Integer hideSequenceCount;

  @Column(name = "makeItSnow")
  @Type(type = "yes_no")
  private Boolean makeItSnow;

  @Transient
  List<PsaSequence> psaSequenceList;

  @Transient
  List<String> remoteViewerPages;

  @Transient
  String activeRemoteViewerPage;
}
