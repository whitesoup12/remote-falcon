package com.remotefalcon.controlpanel.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PASSWORD_RESETS")
public class PasswordReset {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "passwordResetToken")
  private Long passwordResetToken;

  @Column(name = "email")
  private String email;

  @Column(name = "remoteToken")
  private String remoteToken;

  @Column(name = "passwordResetLink")
  private String passwordResetLink;

  @Column(name = "passwordResetExpiry")
  private ZonedDateTime passwordResetExpiry;
}
