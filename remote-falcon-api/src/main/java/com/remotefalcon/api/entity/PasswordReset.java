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
