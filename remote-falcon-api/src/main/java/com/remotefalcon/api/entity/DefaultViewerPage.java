package com.remotefalcon.api.entity;

import jakarta.persistence.*;
import lombok.*;

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
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean isVersionActive;
}
