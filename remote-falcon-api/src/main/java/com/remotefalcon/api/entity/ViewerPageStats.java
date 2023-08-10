package com.remotefalcon.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
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
