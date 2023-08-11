package com.remotefalcon.api.service;

import com.remotefalcon.api.dto.TokenDTO;
import com.remotefalcon.api.entity.DefaultViewerPage;
import com.remotefalcon.api.entity.PasswordReset;
import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.entity.RemotePreference;
import com.remotefalcon.api.enums.EmailTemplate;
import com.remotefalcon.api.enums.ViewerControlMode;
import com.remotefalcon.api.repository.DefaultViewerPageRepository;
import com.remotefalcon.api.repository.PasswordResetRepository;
import com.remotefalcon.api.repository.RemotePreferenceRepository;
import com.remotefalcon.api.repository.RemoteRepository;
import com.remotefalcon.api.response.CheckExistsResponse;
import com.remotefalcon.api.response.RemoteResponse;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.ClientUtil;
import com.remotefalcon.api.util.EmailUtil;
import com.sendgrid.Response;
import org.apache.commons.lang3.RandomStringUtils;
import org.dozer.DozerBeanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class AccountService {
  private final RemoteRepository remoteRepository;
  private final PasswordResetRepository passwordResetRepository;
  private final RemotePreferenceRepository remotePreferenceRepository;
  private final DefaultViewerPageRepository defaultViewerPageRepository;
  private final EmailUtil emailUtil;
  private final DozerBeanMapper mapper;
  private final AuthUtil authUtil;
  private final ClientUtil clientUtil;

  @Autowired
  public AccountService(RemoteRepository remoteRepository, PasswordResetRepository passwordResetRepository, RemotePreferenceRepository remotePreferenceRepository,
                        DefaultViewerPageRepository defaultViewerPageRepository, EmailUtil emailUtil, DozerBeanMapper mapper, AuthUtil authUtil, ClientUtil clientUtil) {
    this.remoteRepository = remoteRepository;
    this.passwordResetRepository = passwordResetRepository;
    this.remotePreferenceRepository = remotePreferenceRepository;
    this.defaultViewerPageRepository = defaultViewerPageRepository;
    this.emailUtil = emailUtil;
    this.mapper = mapper;
    this.authUtil = authUtil;
    this.clientUtil = clientUtil;
  }

  public ResponseEntity<CheckExistsResponse> checkRemoteOrEmailExists(Remote request) {
    Remote remoteByEmail = this.remoteRepository.findByEmail(request.getEmail());
    if (remoteByEmail != null) {
      return ResponseEntity.status(HttpStatus.valueOf(401)).body(CheckExistsResponse.builder().status("EMAIL_EXISTS").build());
    }
    Remote remoteBySubdomain = this.remoteRepository.findByRemoteSubdomain(request.getRemoteSubdomain());
    if (remoteBySubdomain != null) {
      return ResponseEntity.status(HttpStatus.valueOf(401)).body(CheckExistsResponse.builder().status("SHOW_EXISTS").build());
    }
    return ResponseEntity.status(HttpStatus.valueOf(204)).build();
  }

  public ResponseEntity<RemoteResponse> signUp(Remote request, HttpServletRequest httpServletRequest) {
    String remoteSubdomain = request.getRemoteName().replaceAll("\\s", "").toLowerCase();
    String[] basicAuthCredentials = this.authUtil.getBasicAuthCredentials(httpServletRequest);
    if (basicAuthCredentials != null) {
      String email = basicAuthCredentials[0];
      String password = basicAuthCredentials[1];
      Remote remote = this.remoteRepository.findByEmailOrRemoteSubdomain(email, remoteSubdomain);
      if (remote != null) {
        return ResponseEntity.status(HttpStatus.valueOf(401)).build();
      }
      String remoteToken = validateRemoteToken(RandomStringUtils.random(25, true, true));
      BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
      String hashedPassword = passwordEncoder.encode(password);
      request.setEmail(email);
      request.setPassword(hashedPassword);
      request.setRemoteToken(remoteToken);
      request.setRemoteSubdomain(remoteSubdomain);
      request.setCreatedDate(ZonedDateTime.now());
      request.setLastLoginDate(ZonedDateTime.now());
      request.setExpireDate(ZonedDateTime.now().plus(1, ChronoUnit.YEARS));
      request.setEmailVerified(false);
      request.setActiveTheme("dark");
      request.setUserRole("USER");
      DefaultViewerPage defaultViewerPage = this.defaultViewerPageRepository.findFirstByIsVersionActive(true);
      request.setHtmlContent(defaultViewerPage.getHtmlContent());
      remote = this.remoteRepository.save(request);
      Response response = this.emailUtil.sendEmail(remote, null, null, EmailTemplate.VERIFICATION);
      if(response.getStatusCode() != 202) {
        this.remoteRepository.delete(request);
        return ResponseEntity.status(HttpStatus.valueOf(403)).build();
      }
      this.insertDefaultRemotePrefs(remote.getRemoteToken());
      RemoteResponse remoteResponse = this.mapper.map(remote, RemoteResponse.class);
      return ResponseEntity.status(HttpStatus.valueOf(200)).body(remoteResponse);
    }
    return ResponseEntity.status(HttpStatus.valueOf(400)).build();
  }

  private String validateRemoteToken(String remoteToken) {
    Remote remote = this.remoteRepository.findByRemoteToken(remoteToken);
    if(remote == null) {
      return remoteToken;
    }else {
      validateRemoteToken(RandomStringUtils.random(25, true, true));
    }
    return null;
  }

  private void insertDefaultRemotePrefs(String remoteToken) {
    RemotePreference remotePreference = RemotePreference.builder()
            .remoteToken(remoteToken)
            .viewerModeEnabled(true)
            .viewerControlEnabled(true)
            .viewerControlMode(ViewerControlMode.JUKEBOX.viewerControlMode)
            .resetVotes(false)
            .jukeboxDepth(0)
            .enableGeolocation(false)
            .enableLocationCode(false)
            .remoteLatitude(0.0F)
            .remoteLongitude(0.0F)
            .allowedRadius(0.5F)
            .messageDisplayTime(6)
            .interruptSchedule(false)
            .jukeboxRequestLimit(3)
            .jukeboxHistoryLimit(3)
            .apiAccessRequested(false)
            .autoSwitchControlModeSize(0)
            .autoSwitchControlModeToggled(false)
            .hideSequenceCount(0)
            .psaEnabled(false)
            .checkIfVoted(false)
            .makeItSnow(false)
            .build();
    this.remotePreferenceRepository.save(remotePreference);
  }

  public ResponseEntity<RemoteResponse> signIn(HttpServletRequest httpServletRequest) {
    String[] basicAuthCredentials = this.authUtil.getBasicAuthCredentials(httpServletRequest);
    String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
    if (basicAuthCredentials != null) {
      String email = basicAuthCredentials[0];
      String password = basicAuthCredentials[1];
      Remote remote = this.remoteRepository.findByEmail(email);
      if (remote == null) {
        return ResponseEntity.status(HttpStatus.valueOf(401)).build();
      }
      BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
      boolean passwordsMatch = passwordEncoder.matches(password, remote.getPassword());
      if (passwordsMatch) {
        if (!remote.getEmailVerified()) {
          return ResponseEntity.status(HttpStatus.valueOf(403)).build();
        }
        remote.setLastLoginDate(ZonedDateTime.now());
        remote.setExpireDate(ZonedDateTime.now().plus(1, ChronoUnit.YEARS));
        remote.setLastLoginIp(ipAddress);
        this.remoteRepository.save(remote);
        String jwtToken = this.authUtil.signJwt(remote);
        RemoteResponse remoteResponse = this.mapper.map(remote, RemoteResponse.class);
        RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remote.getRemoteToken());
        if(remotePreference != null && remotePreference.getViewerControlMode() != null) {
          remoteResponse.setViewerControlMode(remotePreference.getViewerControlMode());
        }else {
          remoteResponse.setViewerControlMode("JUKEBOX");
        }
        remoteResponse.setServiceToken(jwtToken);
        return ResponseEntity.status(HttpStatus.valueOf(200)).body(remoteResponse);
      }
    }
    return ResponseEntity.status(HttpStatus.valueOf(401)).build();
  }

  public ResponseEntity<?> requestResetPassword(PasswordReset request) {
    Remote remote = this.remoteRepository.findByEmail(request.getEmail());
    if (remote != null) {
      request.setRemoteToken(remote.getRemoteToken());
      request.setPasswordResetLink(request.getPasswordResetLink());
      request.setPasswordResetExpiry(ZonedDateTime.now().plus(1, ChronoUnit.DAYS));
      this.passwordResetRepository.deleteByEmail(request.getEmail());
      this.passwordResetRepository.save(request);
      Response response = this.emailUtil.sendEmail(remote, request, null, EmailTemplate.FORGOT_PASSWORD);
      if(response.getStatusCode() != 202) {
        return ResponseEntity.status(HttpStatus.valueOf(403)).build();
      }
      return ResponseEntity.status(HttpStatus.valueOf(200)).build();
    }
    return ResponseEntity.status(HttpStatus.valueOf(401)).build();
  }

  public ResponseEntity<?> forgotPassword(PasswordReset request) {
    Remote remote = this.remoteRepository.findByEmail(request.getEmail());
    if (remote != null) {
      String passwordResetLink = RandomStringUtils.random(25, true, true);
      request.setRemoteToken(remote.getRemoteToken());
      request.setPasswordResetLink(passwordResetLink);
      request.setPasswordResetExpiry(ZonedDateTime.now().plus(1, ChronoUnit.DAYS));
      this.passwordResetRepository.deleteByEmail(request.getEmail());
      this.passwordResetRepository.save(request);
      Response response = this.emailUtil.sendEmail(remote, request, null, EmailTemplate.FORGOT_PASSWORD);
      if(response.getStatusCode() != 202) {
        return ResponseEntity.status(HttpStatus.valueOf(403)).build();
      }
      return ResponseEntity.status(HttpStatus.valueOf(200)).build();
    }
    return ResponseEntity.status(HttpStatus.valueOf(401)).build();
  }

  public ResponseEntity<?> resendVerificationEmail(Remote request) {
    Remote remote = this.remoteRepository.findByEmail(request.getEmail());
    if (remote != null) {
      this.emailUtil.sendEmail(remote, null, null, EmailTemplate.VERIFICATION);
      return ResponseEntity.status(HttpStatus.valueOf(200)).build();
    }
    return ResponseEntity.status(HttpStatus.valueOf(401)).build();
  }

  public ResponseEntity<?> verifyEmail(Remote request) {
    Remote remote = this.remoteRepository.findByRemoteToken(request.getRemoteToken());
    if (remote != null) {
      remote.setEmailVerified(true);
      this.remoteRepository.save(remote);
      return ResponseEntity.status(HttpStatus.valueOf(200)).build();
    }
    return ResponseEntity.status(HttpStatus.valueOf(401)).build();
  }

  public ResponseEntity<String> verifyResetPasswordLink(PasswordReset request) {
    PasswordReset passwordReset = this.passwordResetRepository.findByPasswordResetLinkAndPasswordResetExpiryGreaterThan(request.getPasswordResetLink(), ZonedDateTime.now());
    if (passwordReset != null) {
      Remote remote = this.remoteRepository.findByRemoteToken(passwordReset.getRemoteToken());
      String jwt = this.authUtil.signJwt(remote);
      return ResponseEntity.status(HttpStatus.valueOf(200)).body(jwt);
    }
    return ResponseEntity.status(HttpStatus.valueOf(401)).build();
  }

  public ResponseEntity<?> checkRemoteTokenExists(Remote request) {
    Remote remote = this.remoteRepository.findByRemoteToken(request.getRemoteToken());
    if (remote == null) {
      return ResponseEntity.status(HttpStatus.valueOf(204)).build();
    }
    return ResponseEntity.status(HttpStatus.valueOf(200)).build();
  }

  public ResponseEntity<?> resetPassword(HttpServletRequest httpServletRequest) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Remote remote = this.remoteRepository.findByRemoteToken(tokenDTO.getRemoteToken());
    if(remote == null) {
      return ResponseEntity.status(401).build();
    }
    String updatedPassword = this.authUtil.getPasswordFromHeader(httpServletRequest);
    if (updatedPassword != null) {
      BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
      String hashedPassword = passwordEncoder.encode(updatedPassword);
      remote.setPassword(hashedPassword);
      this.remoteRepository.save(remote);
      PasswordReset passwordReset = this.passwordResetRepository.findByRemoteToken(tokenDTO.getRemoteToken());
      if (passwordReset != null) {
        this.passwordResetRepository.delete(passwordReset);
      }
      return ResponseEntity.status(200).build();
    }
    return ResponseEntity.status(400).build();
  }

  public ResponseEntity<String> getIp(HttpServletRequest httpServletRequest) {
    String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
    return ResponseEntity.status(200).body(ipAddress);
  }
}
