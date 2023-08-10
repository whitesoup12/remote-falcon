package com.remotefalcon.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Type;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
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
  @Type(type = "yes_no")
  private Boolean isActive;

  @Column(name = "createdDate")
  private ZonedDateTime createdDate;
}
