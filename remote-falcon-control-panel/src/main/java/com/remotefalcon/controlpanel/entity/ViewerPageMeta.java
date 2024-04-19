package com.remotefalcon.controlpanel.entity;

import lombok.*;

import jakarta.persistence.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "VIEWER_PAGE_META")
public class ViewerPageMeta {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "viewerPageMetaKey")
  private Long viewerPageMetaKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "viewerPageTitle")
  private String viewerPageTitle;

  @Column(name = "viewerPageIconLink")
  private String viewerPageIconLink;
}
