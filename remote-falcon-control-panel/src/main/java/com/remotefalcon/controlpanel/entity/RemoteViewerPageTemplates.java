package com.remotefalcon.controlpanel.entity;

import lombok.*;

import jakarta.persistence.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "REMOTE_VIEWER_PAGE_TEMPLATES")
public class RemoteViewerPageTemplates {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "remoteViewerPageTemplateKey")
  private Long remoteViewerPageTemplateKey;

  @Column(name = "viewerPageTemplateName")
  private String viewerPageTemplateName;

  @Column(name = "viewerPageTemplateHtml")
  private String viewerPageTemplateHtml;

  @Column(name = "isActive")
  @Convert(converter = org.hibernate.type.YesNoConverter.class)
  private Boolean isActive;
}
