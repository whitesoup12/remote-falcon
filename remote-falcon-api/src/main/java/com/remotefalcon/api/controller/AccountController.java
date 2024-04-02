package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresAccess;
import com.remotefalcon.api.documents.Show;
import com.remotefalcon.api.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AccountController {
  private final AccountService accountService;

  @MutationMapping
  public Show signUp(@Argument String firstName, @Argument String lastName, @Argument String showName) {
    return accountService.signUp(firstName, lastName, showName);
  }

  @QueryMapping
  public Show signIn() {
    return accountService.signIn();
  }

  @MutationMapping
  public Boolean forgotPassword(@Argument String email) {
    return accountService.forgotPassword(email);
  }

  @MutationMapping
  public Boolean verifyEmail(@Argument String showToken) {
    return accountService.verifyEmail(showToken);
  }

  @QueryMapping
  public Show verifyPasswordResetLink(@Argument String passwordResetLink) {
    return accountService.verifyPasswordResetLink(passwordResetLink);
  }

  @MutationMapping
  @RequiresAccess
  public Boolean resetPassword() {
    return this.accountService.resetPassword();
  }
}
