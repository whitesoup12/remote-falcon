package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresAccess;
import com.remotefalcon.api.documents.Show;
import com.remotefalcon.api.service.AccountService;
import com.remotefalcon.api.service.legacy.AccountServiceLegacy;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AccountController {
  private final AccountService accountService;
  private AccountServiceLegacy accountServiceLegacy;

  @PostMapping(value = "/account/signUp")
  public ResponseEntity<Show> signUp(@RequestBody Show request, HttpServletRequest httpServletRequest) {
    return accountService.signUp(request, httpServletRequest);
  }

  @PostMapping(value = "/account/signIn")
  public ResponseEntity<Show> signIn(HttpServletRequest httpServletRequest) {
    return accountService.signIn(httpServletRequest);
  }

  @PostMapping(value = "/account/forgotPassword")
  public ResponseEntity<?> forgotPassword(@RequestBody Show request) {
    return accountService.forgotPassword(request);
  }

  @PostMapping(value = "/account/verifyEmail")
  public ResponseEntity<?> verifyEmail(@RequestBody Show request) {
    return accountService.verifyEmail(request);
  }

  @PostMapping(value = "/account/verifyResetPasswordLink")
  public ResponseEntity<String> verifyResetPasswordLink(@RequestBody Show request) {
    return accountService.verifyResetPasswordLink(request);
  }

  @PostMapping(value = "/account/resetPassword")
  @RequiresAccess
  public ResponseEntity<?> resetPassword(HttpServletRequest httpServletRequest) {
    return this.accountService.resetPassword(httpServletRequest);
  }
}
