package com.remotefalcon.api.service;

import com.remotefalcon.api.documents.Show;
import com.remotefalcon.api.dto.TokenDTO;
import com.remotefalcon.api.entity.PasswordReset;
import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.enums.EmailTemplate;
import com.remotefalcon.api.enums.ViewerControlMode;
import com.remotefalcon.api.repository.PasswordResetRepository;
import com.remotefalcon.api.repository.RemotePreferenceRepository;
import com.remotefalcon.api.repository.RemoteRepository;
import com.remotefalcon.api.repository.ShowRepository;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.ClientUtil;
import com.remotefalcon.api.util.EmailUtil;
import com.remotefalcon.api.util.RandomUtil;
import com.sendgrid.Response;
import jakarta.servlet.http.HttpServletRequest;
import org.dozer.DozerBeanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class AccountService {
  private final RemoteRepository remoteRepository;
  private final PasswordResetRepository passwordResetRepository;
  private final RemotePreferenceRepository remotePreferenceRepository;
  private final EmailUtil emailUtil;
  private final DozerBeanMapper mapper;
  private final AuthUtil authUtil;
  private final ClientUtil clientUtil;
  private final ShowRepository showRepository;

  @Autowired
  public AccountService(RemoteRepository remoteRepository, PasswordResetRepository passwordResetRepository, RemotePreferenceRepository remotePreferenceRepository,
                        EmailUtil emailUtil, DozerBeanMapper mapper, AuthUtil authUtil, ClientUtil clientUtil, ShowRepository showRepository) {
    this.remoteRepository = remoteRepository;
    this.passwordResetRepository = passwordResetRepository;
    this.remotePreferenceRepository = remotePreferenceRepository;
    this.emailUtil = emailUtil;
    this.mapper = mapper;
    this.authUtil = authUtil;
    this.clientUtil = clientUtil;
    this.showRepository = showRepository;
  }

  public ResponseEntity<Show> signUp(Show request, HttpServletRequest httpServletRequest) {
    String showSubdomain = request.getShowName().replaceAll("\\s", "").toLowerCase();
    String[] basicAuthCredentials = this.authUtil.getBasicAuthCredentials(httpServletRequest);
    if (basicAuthCredentials != null) {
      String email = basicAuthCredentials[0];
      String password = basicAuthCredentials[1];
      Optional<Show> show = this.showRepository.findByEmailOrShowSubdomain(email, showSubdomain);
      if (show.isPresent()) {
        return ResponseEntity.status(HttpStatus.valueOf(401)).build();
      }
      String showToken = this.validateShowToken(RandomUtil.generateToken(25));
      BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
      String hashedPassword = passwordEncoder.encode(password);

      Show newShow = this.buildNewShow(request, email, hashedPassword, showToken, showSubdomain);

      Response emailResponse = this.emailUtil.sendEmail(newShow, null, null, EmailTemplate.VERIFICATION);
      if(emailResponse.getStatusCode() != 202) {
        return ResponseEntity.status(HttpStatus.valueOf(403)).build();
      }

      newShow = this.showRepository.save(newShow);
      //No need to send password back in the response
      newShow.setPassword(null);
      return ResponseEntity.status(HttpStatus.valueOf(200)).body(newShow);
    }
    return ResponseEntity.status(HttpStatus.valueOf(400)).build();
  }

  private Show buildNewShow(Show request, String email, String password, String showToken, String showSubdomain) {
    return Show.builder()
            .email(email)
            .password(password)
            .showToken(showToken)
            .showName(request.getShowName())
            .showSubdomain(showSubdomain)
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .createdDate(LocalDateTime.now())
            .emailVerified(false)
            .build();
  }

  private String validateShowToken(String showToken) {
    Optional<Show> show = this.showRepository.findByShowToken(showToken);
    if(show.isEmpty()) {
      return showToken;
    }else {
      validateShowToken(RandomUtil.generateToken(25));
    }
    return null;
  }

  public ResponseEntity<Show> signIn(HttpServletRequest httpServletRequest) {
    String[] basicAuthCredentials = this.authUtil.getBasicAuthCredentials(httpServletRequest);
    if (basicAuthCredentials != null) {
      String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
      String email = basicAuthCredentials[0];
      String password = basicAuthCredentials[1];
      Optional<Show> optionalShow = this.showRepository.findByEmail(email);
      if (optionalShow.isEmpty()) {
        return ResponseEntity.status(HttpStatus.valueOf(401)).build();
      }
      Show show = optionalShow.get();
      BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
      boolean passwordsMatch = passwordEncoder.matches(password, show.getPassword());
      if (passwordsMatch) {
        if (!show.getEmailVerified()) {
          return ResponseEntity.status(HttpStatus.valueOf(403)).build();
        }
        show.setLastLoginDate(LocalDateTime.now());
        show.setExpireDate(LocalDateTime.now().plusYears(1));
        show.setLastLoginIp(ipAddress);
        this.showRepository.save(show);
        if(show.getViewerControlMode() == null) {
          show.setViewerControlMode(ViewerControlMode.JUKEBOX.name());
        }
        String jwtToken = this.authUtil.signJwt(show);
        show.setServiceToken(jwtToken);
        return ResponseEntity.status(HttpStatus.valueOf(200)).body(show);
      }
    }
    return ResponseEntity.status(HttpStatus.valueOf(401)).build();
  }

  public ResponseEntity<?> forgotPassword(PasswordReset request) {
    Remote remote = this.remoteRepository.findByEmail(request.getEmail());
    if (remote != null) {
      String passwordResetLink = RandomUtil.generateToken(25);
      request.setRemoteToken(remote.getRemoteToken());
      request.setPasswordResetLink(passwordResetLink);
      request.setPasswordResetExpiry(ZonedDateTime.now().plus(1, ChronoUnit.DAYS));
      this.passwordResetRepository.deleteByEmail(request.getEmail());
      this.passwordResetRepository.save(request);
      Response response = this.emailUtil.sendEmail(null, request, null, EmailTemplate.FORGOT_PASSWORD);
      if(response.getStatusCode() != 202) {
        return ResponseEntity.status(HttpStatus.valueOf(403)).build();
      }
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
      String jwt = this.authUtil.signJwt(null);
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
