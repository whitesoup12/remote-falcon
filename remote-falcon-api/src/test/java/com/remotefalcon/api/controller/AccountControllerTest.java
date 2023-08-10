package com.remotefalcon.api.controller;

import com.remotefalcon.api.Mocks;
import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.service.AccountService;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.junit.runner.RunWith;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class AccountControllerTest {

  @InjectMocks AccountController accountController;

  @Mock
  private AccountService accountService;

  @Test
  public void checkRemoteOrEmailExists() {
    when(this.accountService.checkRemoteOrEmailExists(any(Remote.class))).thenReturn(ResponseEntity.status(200).build());
    ResponseEntity<?> response = this.accountController.checkRemoteOrEmailExists(Mocks.remote());
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
  }
}
