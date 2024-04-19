package com.remotefalcon.controlpanel.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "REMOTES")
public class Remote {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "remoteKey")
  private Long remoteKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "email")
  private String email;

  @Column(name = "password")
  private String password;

  @Column(name = "remoteName")
  private String remoteName;

  @Column(name = "remoteSubdomain")
  private String remoteSubdomain;

  @Column(name = "emailVerified")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean emailVerified;

  @Column(name = "createdDate")
  private ZonedDateTime createdDate;

  @Column(name = "lastLoginDate")
  private ZonedDateTime lastLoginDate;

  @Column(name = "expireDate")
  private ZonedDateTime expireDate;

  @Column(name = "pluginVersion")
  private String pluginVersion;

  @Column(name = "activeTheme")
  private String activeTheme;

  @Column(name = "fppVersion")
  private String fppVersion;

  @Column(name = "lastLoginIp")
  private String lastLoginIp;

  @Column(name = "htmlContent")
  private String htmlContent;

  @Column(name = "firstName")
  private String firstName;

  @Column(name = "lastName")
  private String lastName;

  @Column(name = "facebookUrl")
  private String facebookUrl;

  @Column(name = "youtubeUrl")
  private String youtubeUrl;

  @Column(name = "userRole")
  private String userRole;
}
