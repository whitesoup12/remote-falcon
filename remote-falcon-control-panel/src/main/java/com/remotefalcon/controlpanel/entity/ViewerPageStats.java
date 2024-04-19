package com.remotefalcon.controlpanel.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "VIEWER_PAGE_STATS")
public class ViewerPageStats {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "viewerPageStatKey")
  private Long viewerPageStatKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "pageVisitIp")
  private String pageVisitIp;

  @Column(name = "pageVisitDateTime")
  private ZonedDateTime pageVisitDateTime;

  @Transient
  private Long pageVisitDate;
  @Transient
  private Integer uniqueVisits;
  @Transient
  private Integer totalVisits;
}
