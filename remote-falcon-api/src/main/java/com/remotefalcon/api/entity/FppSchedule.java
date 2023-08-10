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

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "FPP_SCHEDULE")
public class FppSchedule {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "fppScheduleKey")
  private Long fppScheduleKey;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "nextScheduledSequence")
  private String nextScheduledSequence;
}
