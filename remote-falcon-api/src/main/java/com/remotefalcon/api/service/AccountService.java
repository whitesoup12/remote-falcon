package com.remotefalcon.api.service;

import com.remotefalcon.api.documents.Show;
import com.remotefalcon.api.documents.models.Preference;
import com.remotefalcon.api.documents.models.Stat;
import com.remotefalcon.api.dto.TokenDTO;
import com.remotefalcon.api.enums.StatusResponse;
import com.remotefalcon.api.enums.UserRole;
import com.remotefalcon.api.enums.ViewerControlMode;
import com.remotefalcon.api.repository.mongo.ShowRepository;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.ClientUtil;
import com.remotefalcon.api.util.EmailUtil;
import com.remotefalcon.api.util.RandomUtil;
import com.sendgrid.Response;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountService {
  private final EmailUtil emailUtil;
  private final AuthUtil authUtil;
  private final ClientUtil clientUtil;
  private final ShowRepository showRepository;
  private final HttpServletRequest httpServletRequest;

  public Show signUp(String firstName, String lastName, String showName) {
    String showSubdomain = showName.replaceAll("\\s", "").toLowerCase();
    String[] basicAuthCredentials = this.authUtil.getBasicAuthCredentials(httpServletRequest);
    if (basicAuthCredentials != null) {
      String email = basicAuthCredentials[0];
      String password = basicAuthCredentials[1];
      Optional<Show> show = this.showRepository.findByEmailOrShowSubdomain(email, showSubdomain);
      if (show.isPresent()) {
        throw new RuntimeException(StatusResponse.SHOW_EXISTS.name());
      }
      String showToken = this.validateShowToken(RandomUtil.generateToken(25));
      BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
      String hashedPassword = passwordEncoder.encode(password);

      Show newShow = this.createDefaultShowDocument(firstName, lastName, showName, email,
              hashedPassword, showToken, showSubdomain);

      Response emailResponse = this.emailUtil.sendSignUpEmail(newShow);
      if(emailResponse.getStatusCode() != 202) {
        throw new RuntimeException(StatusResponse.EMAIL_CANNOT_BE_SENT.name());
      }

      newShow = this.showRepository.save(newShow);
      return newShow;
    }
    throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
  }

  private Show createDefaultShowDocument(String firstName, String lastName, String showName,
                                                                        String email, String password, String showToken,
                                                                        String showSubdomain) {
    return Show.builder()
            .showToken(showToken)
            .email(email)
            .password(password)
            .showName(showName)
            .showSubdomain(showSubdomain)
            .firstName(firstName)
            .lastName(lastName)
            .emailVerified(false)
            .createdDate(LocalDateTime.now())
            .expireDate(LocalDateTime.now().plusDays(90))
            .userRole(UserRole.USER)
            .preference(Preference.builder()
                    .viewerControlEnabled(false)
                    .viewerControlMode(ViewerControlMode.JUKEBOX)
                    .resetVotes(false)
                    .jukeboxDepth(0)
                    .remoteLatitude(0.0F)
                    .remoteLongitude(0.0F)
                    .allowedRadius(1.0F)
                    .checkIfVoted(false)
                    .psaEnabled(false)
                    .jukeboxRequestLimit(0)
                    .hideSequenceCount(0)
                    .makeItSnow(false)
                    .managePsa(false)
                    .sequencesPlayed(0)
                    .build())
            .stat(Stat.builder()
                    .jukebox(new ArrayList<>())
                    .page(new ArrayList<>())
                    .voting(new ArrayList<>())
                    .votingWin(new ArrayList<>())
                    .build())
            .pages(new ArrayList<>())
            .sequences(new ArrayList<>())
            .sequenceGroups(new ArrayList<>())
            .psaSequences(new ArrayList<>())
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

  public Show signIn() {
    String[] basicAuthCredentials = this.authUtil.getBasicAuthCredentials(httpServletRequest);
    if (basicAuthCredentials != null) {
      String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
      String email = basicAuthCredentials[0];
      String password = basicAuthCredentials[1];
      Optional<Show> optionalShow = this.showRepository.findByEmail(email);
      if (optionalShow.isEmpty()) {
        log.info(StatusResponse.SHOW_NOT_FOUND.name());
        throw new RuntimeException(StatusResponse.SHOW_NOT_FOUND.name());
      }
      Show show = optionalShow.get();
      BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
      boolean passwordsMatch = passwordEncoder.matches(password, show.getPassword());
      if (passwordsMatch) {
        if (!show.getEmailVerified()) {
          log.info(StatusResponse.EMAIL_NOT_VERIFIED.name());
          throw new RuntimeException(StatusResponse.EMAIL_NOT_VERIFIED.name());
        }
        show.setLastLoginDate(LocalDateTime.now());
        show.setExpireDate(LocalDateTime.now().plusYears(1));
        show.setLastLoginIp(ipAddress);
        if(show.getPreference().getViewerControlMode() == null) {
          show.getPreference().setViewerControlMode(ViewerControlMode.JUKEBOX);
        }
        this.showRepository.save(show);
        show.setServiceToken(this.authUtil.signJwt(show));
        return show;
      }
    }
    log.info(StatusResponse.UNAUTHORIZED.name());
    throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
  }

  public Boolean forgotPassword(String email) {
    Optional<Show> show = this.showRepository.findByEmail(email);
    if(show.isPresent()) {
      String passwordResetLink = RandomUtil.generateToken(25);
      show.get().setPasswordResetLink(passwordResetLink);
      show.get().setPasswordResetExpiry(LocalDateTime.now().plusDays(1));
      this.showRepository.save(show.get());
      Response response = this.emailUtil.sendForgotPasswordEmail(show.get(), passwordResetLink);
      if(response.getStatusCode() != 202) {
        throw new RuntimeException(StatusResponse.EMAIL_CANNOT_BE_SENT.name());
      }
      return true;
    }
    throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
  }

  public Boolean verifyEmail(String showToken) {
    Optional<Show> show = this.showRepository.findByShowToken(showToken);
    if(show.isPresent()) {
      show.get().setEmailVerified(true);
      this.showRepository.save(show.get());
      return true;
    }
    throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
  }

  public Show verifyPasswordResetLink(String passwordResetLink) {
    Optional<Show> show = this.showRepository.findByPasswordResetLinkAndPasswordResetExpiryGreaterThan(passwordResetLink, LocalDateTime.now());
    if(show.isPresent()) {
      String jwt = this.authUtil.signJwt(show.get());
      show.get().setServiceToken(jwt);
      return show.get();
    }
    throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
  }

  public Boolean resetPassword() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Optional<Show> show = this.showRepository.findByShowToken(tokenDTO.getShowToken());
    if(show.isEmpty()) {
      throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
    }
    String updatedPassword = this.authUtil.getPasswordFromHeader(httpServletRequest);
    if (updatedPassword != null) {
      BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
      String hashedPassword = passwordEncoder.encode(updatedPassword);
      show.get().setPassword(hashedPassword);
      show.get().setPasswordResetLink(null);
      show.get().setPasswordResetExpiry(null);
      this.showRepository.save(show.get());
      return true;
    }
    throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
  }
}
