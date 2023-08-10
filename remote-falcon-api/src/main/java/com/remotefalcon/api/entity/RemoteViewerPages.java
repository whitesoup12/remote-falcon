package com.remotefalcon.api.entity;

import lombok.*;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "REMOTE_VIEWER_PAGES")
public class RemoteViewerPages {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "remoteViewerPageKey")
  private Long remoteViewerPageKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "viewerPageName")
  private String viewerPageName;

  @Column(name = "viewerPageActive")
  @Type(type = "yes_no")
  private Boolean viewerPageActive;

  @Column(name = "viewerPageHtml")
  private String viewerPageHtml;
}
