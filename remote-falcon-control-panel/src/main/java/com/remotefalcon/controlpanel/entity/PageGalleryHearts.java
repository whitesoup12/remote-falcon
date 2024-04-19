package com.remotefalcon.controlpanel.entity;

import lombok.*;

import jakarta.persistence.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PAGE_GALLERY_HEARTS")
public class PageGalleryHearts {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "pageGalleryHeartsKey")
  private Long pageGalleryHeartsKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "viewerPage")
  private String viewerPage;

  @Column(name = "viewerPageHearted")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean viewerPageHearted;

  @Transient
  private Integer viewerPageHeartCount;
}
