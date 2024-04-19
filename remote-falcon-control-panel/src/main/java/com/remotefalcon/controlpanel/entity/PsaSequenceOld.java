package com.remotefalcon.controlpanel.entity;

import lombok.*;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PSA_SEQUENCES")
public class PsaSequenceOld {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "psaSequenceKey")
  private Long psaSequenceKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "psaSequenceName")
  private String psaSequenceName;

  @Column(name = "psaSequenceOrder")
  private Integer psaSequenceOrder;

  @Column(name = "psaSequenceLastPlayed")
  private ZonedDateTime psaSequenceLastPlayed;
}
