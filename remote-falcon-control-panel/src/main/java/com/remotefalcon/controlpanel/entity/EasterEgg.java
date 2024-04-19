package com.remotefalcon.controlpanel.entity;

import lombok.*;

import jakarta.persistence.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "EASTER_EGG")
public class EasterEgg {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "easterEggKey")
  private Long easterEggKey;

  @Column(name = "remoteToken")
  private String remoteToken;
}
