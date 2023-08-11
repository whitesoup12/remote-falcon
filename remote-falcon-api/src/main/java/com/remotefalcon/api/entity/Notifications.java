package com.remotefalcon.api.entity;

import lombok.*;
import org.hibernate.annotations.Type;

import jakarta.persistence.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "NOTIFICATIONS")
public class Notifications {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "notificationKey")
  private Long notificationKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "notificationTitle")
  private String notificationTitle;

  @Column(name = "notificationPreview")
  private String notificationPreview;

  @Column(name = "notificationText")
  private String notificationText;

  @Column(name = "notificationRead")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean notificationRead;
}
