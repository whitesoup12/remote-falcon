package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresAccess;
import com.remotefalcon.api.documents.Show;
import com.remotefalcon.api.entity.PasswordReset;
import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AccountController {
  @Autowired
  private AccountService accountService;

  @PostMapping(value = "/account/signUp")
  public ResponseEntity<Show> signUp(@RequestBody Show request, HttpServletRequest httpServletRequest) {
    return accountService.signUp(request, httpServletRequest);
  }

  @PostMapping(value = "/account/signIn")
  public ResponseEntity<Show> signIn(HttpServletRequest httpServletRequest) {
    return accountService.signIn(httpServletRequest);
  }

  @PostMapping(value = "/account/forgotPassword")
  public ResponseEntity<?> forgotPassword(@RequestBody PasswordReset request) {
    return accountService.forgotPassword(request);
  }

  @PostMapping(value = "/account/verifyEmail")
  public ResponseEntity<?> verifyEmail(@RequestBody Remote request) {
    return accountService.verifyEmail(request);
  }

  @PostMapping(value = "/account/verifyResetPasswordLink")
  public ResponseEntity<String> verifyResetPasswordLink(@RequestBody PasswordReset request) {
    return accountService.verifyResetPasswordLink(request);
  }

  @PostMapping(value = "/account/checkRemoteTokenExists")
  public ResponseEntity<?> checkRemoteTokenExists(@RequestBody Remote request) {
    return accountService.checkRemoteTokenExists(request);
  }

  @GetMapping(value = "/account/ip")
  public ResponseEntity<String> checkRemoteTokenExists(HttpServletRequest httpServletRequest) {
    return accountService.getIp(httpServletRequest);
  }

  @PostMapping(value = "/account/resetPassword")
  @RequiresAccess
  public ResponseEntity<?> resetPassword(HttpServletRequest httpServletRequest) {
    return this.accountService.resetPassword(httpServletRequest);
  }
}
