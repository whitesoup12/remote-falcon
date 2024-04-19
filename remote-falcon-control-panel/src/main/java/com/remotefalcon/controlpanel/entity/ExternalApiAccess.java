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
@Table(name = "EXTERNAL_API_ACCESS")
public class ExternalApiAccess {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "externalApiAccessKey")
  private Long externalApiAccessKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "accessToken")
  private String accessToken;

  @Column(name = "accessSecret")
  private String accessSecret;

  @Column(name = "isActive")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean isActive;

  @Column(name = "createdDate")
  private ZonedDateTime createdDate;
}
