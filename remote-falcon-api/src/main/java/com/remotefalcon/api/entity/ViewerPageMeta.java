package com.remotefalcon.api.entity;

import lombok.*;
import org.hibernate.annotations.Type;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

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
