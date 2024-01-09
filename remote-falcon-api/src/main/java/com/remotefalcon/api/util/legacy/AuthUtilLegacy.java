package com.remotefalcon.api.util.legacy;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.remotefalcon.api.dto.TokenDTO;
import com.remotefalcon.api.dto.ViewerTokenDTO;
import com.remotefalcon.api.entity.ExternalApiAccess;
import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.repository.ExternalApiAccessRepository;
import com.remotefalcon.api.repository.RemoteRepository;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Slf4j
public class AuthUtilLegacy {
  private final RemoteRepository remoteRepository;
  private final ExternalApiAccessRepository externalApiAccessRepository;

  @Value("${JWT_SIGN_KEY}")
  String jwtSignKey;

  @Value("${JWT_VIEWER_SIGN_KEY}")
  String jwtViewerSignKey;

  @Autowired
  public AuthUtilLegacy(RemoteRepository remoteRepository, ExternalApiAccessRepository externalApiAccessRepository) {
    this.remoteRepository = remoteRepository;
    this.externalApiAccessRepository = externalApiAccessRepository;
  }

  public String signJwt(Remote remote) {
    Map<String, Object> jwtPayload = new HashMap<String, Object>();
    jwtPayload.put("remoteToken", remote.getRemoteToken());
    jwtPayload.put("email", remote.getEmail());
    jwtPayload.put("remoteSubdomain", remote.getRemoteSubdomain());
    try {
      Algorithm algorithm = Algorithm.HMAC256(jwtSignKey);
      return JWT.create().withClaim("user-data", jwtPayload)
              .withIssuer("remotefalcon")
              .withExpiresAt(Date.from(ZonedDateTime.now().plus(30, ChronoUnit.DAYS).toInstant()))
              .sign(algorithm);
    } catch (JWTCreationException e) {
      log.error("Error creating JWT", e);
      return null;
    }
  }

  public TokenDTO getJwtPayload() {
    HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    String token = this.getTokenFromRequest(request);
    DecodedJWT decodedJWT = JWT.decode(token);
    Map<String, Object> userDataMap = decodedJWT.getClaim("user-data").asMap();
    return TokenDTO.builder()
            .showToken((String) userDataMap.get("showToken"))
            .email((String) userDataMap.get("email"))
            .showSubdomain((String) userDataMap.get("showSubdomain"))
            .build();
  }

  public ViewerTokenDTO getViewerJwtPayload() {
    HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    String token = this.getTokenFromRequest(request);
    if(token == null) {
      return null;
    }
    DecodedJWT decodedJWT = JWT.decode(token);
    String subdomain = decodedJWT.getClaims().get("subdomain").asString();
    Remote remote = this.remoteRepository.findByRemoteSubdomain(subdomain);
    if(remote == null) {
      return null;
    }
    return ViewerTokenDTO.builder()
            .showSubdomain(subdomain)
            .showToken(remote.getRemoteToken())
            .build();
  }

  public ExternalApiAccess getApiAccessFromApiJwt() {
    HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    String token = this.getTokenFromRequest(request);
    DecodedJWT decodedJWT = JWT.decode(token);
    String accessToken = decodedJWT.getClaims().get("accessToken").asString();
    Optional<ExternalApiAccess> externalApiAccess = this.externalApiAccessRepository.findByAccessToken(accessToken);
    return externalApiAccess.orElse(null);
  }

  public Boolean isJwtValid(HttpServletRequest httpServletRequest) throws JWTVerificationException {
    try {
      String token = this.getTokenFromRequest(httpServletRequest);
      if (StringUtils.isEmpty(token)) {
        return false;
      }
      Algorithm algorithm = Algorithm.HMAC256(jwtSignKey);
      JWTVerifier verifier = JWT.require(algorithm).withIssuer("remotefalcon").build();
      verifier.verify(token);
      return true;
    } catch (JWTVerificationException e) {
      return false;
    }
  }

  public Boolean isApiJwtValid(HttpServletRequest httpServletRequest) throws JWTVerificationException {
    try {
      String token = this.getTokenFromRequest(httpServletRequest);
      if (StringUtils.isEmpty(token)) {
        return false;
      }
      ExternalApiAccess externalApiAccess = this.getApiAccessFromApiJwt();
      if(externalApiAccess == null) {
        return false;
      }
      Algorithm algorithm = Algorithm.HMAC256(externalApiAccess.getAccessSecret());
      JWTVerifier verifier = JWT.require(algorithm).build();
      verifier.verify(token);
      return true;
    } catch (JWTVerificationException e) {
      return false;
    }
  }

  public Boolean isAdminJwtValid(HttpServletRequest httpServletRequest) throws JWTVerificationException {
    if(this.isJwtValid(httpServletRequest)) {
      TokenDTO tokenDTO = this.getJwtPayload();
      Remote remote = this.remoteRepository.findByRemoteTokenAndUserRole(tokenDTO.getShowToken(), "ADMIN");
      return remote != null;
    }
    return false;
  }

  public Boolean isViewerJwtValid(HttpServletRequest httpServletRequest) throws JWTVerificationException {
    try {
      String token = this.getTokenFromRequest(httpServletRequest);
      if (StringUtils.isEmpty(token)) {
        return false;
      }
      Algorithm algorithm = Algorithm.HMAC256(jwtViewerSignKey);
      JWTVerifier verifier = JWT.require(algorithm).withIssuer("remotefalcon").build();
      verifier.verify(token);
      return true;
    } catch (JWTVerificationException e) {
      return false;
    }
  }

  private String getTokenFromRequest(HttpServletRequest httpServletRequest) {
    String token = "";
    final String authorization = httpServletRequest.getHeader("Authorization");
    if (authorization != null && authorization.toLowerCase().startsWith("bearer")) {
      try {
        token = authorization.split(" ")[1];
      }catch (Exception e) {
        log.error("Error getting token from request");
      }
    }
    return token;
  }

  public String[] getBasicAuthCredentials(HttpServletRequest httpServletRequest) {
    final String authorization = httpServletRequest.getHeader("Authorization");
    if (authorization != null && authorization.toLowerCase().startsWith("basic")) {
      String base64Credentials = authorization.substring("Basic".length()).trim();
      byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
      String credentials = new String(credDecoded, StandardCharsets.UTF_8);
      return credentials.split(":", 2);
    }
    return null;
  }

  public String getPasswordFromHeader(HttpServletRequest httpServletRequest) {
    final String password = httpServletRequest.getHeader("Password");
    if (password != null) {
      return new String(Base64.getDecoder().decode(password));
    }
    return null;
  }

  public String getEmailFromHeader(HttpServletRequest httpServletRequest) {
    final String email = httpServletRequest.getHeader("Email");
    if (email != null) {
      return new String(Base64.getDecoder().decode(email));
    }
    return null;
  }

  public String getUpdatedPasswordFromHeader(HttpServletRequest httpServletRequest) {
    final String password = httpServletRequest.getHeader("NewPassword");
    if (password != null) {
      return new String(Base64.getDecoder().decode(password));
    }
    return null;
  }

  public String getRemoteTokenFromHeader() {
    HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    return request.getHeader("remotetoken");
  }
}