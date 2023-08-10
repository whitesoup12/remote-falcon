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
@Table(name = "DEFAULT_VIEWER_PAGE")
public class DefaultViewerPage {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "defaultViewerPageKey")
  private Long defaultViewerPageKey;

  @Column(name = "version")
  private Float version;

  @Column(name = "versionCreateDate")
  private ZonedDateTime versionCreateDate;

  @Column(name = "htmlContent")
  private String htmlContent;

  @Column(name = "isVersionActive")
  @Type(type = "yes_no")
  private Boolean isVersionActive;
}
