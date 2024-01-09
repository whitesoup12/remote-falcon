//package com.remotefalcon.api.service;
//
//import com.remotefalcon.api.Mocks;
//import com.remotefalcon.api.dto.TokenDTO;
//import com.remotefalcon.api.entity.*;
//import com.remotefalcon.api.enums.EmailTemplate;
//import com.remotefalcon.api.repository.DefaultViewerPageRepository;
//import com.remotefalcon.api.repository.PasswordResetRepository;
//import com.remotefalcon.api.repository.RemotePreferenceRepository;
//import com.remotefalcon.api.repository.RemoteRepository;
//import com.remotefalcon.api.response.CheckExistsResponse;
//import com.remotefalcon.api.response.RemoteResponse;
//import com.remotefalcon.api.util.AuthUtil;
//import com.remotefalcon.api.util.ClientUtil;
//import com.remotefalcon.api.util.EmailUtil;
//import com.sendgrid.Response;
//import org.dozer.DozerBeanMapper;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.MockitoJUnitRunner;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//
//import jakarta.servlet.http.HttpServletRequest;
//
//import java.time.ZonedDateTime;
//
//import static org.junit.Assert.*;
//import static org.mockito.Mockito.*;
//
//@RunWith(MockitoJUnitRunner.class)
//public class AccountServiceTest {
//
//  @InjectMocks AccountService accountService;
//
//  @Mock private RemoteRepository remoteRepository;
//  @Mock private PasswordResetRepository passwordResetRepository;
//  @Mock private RemotePreferenceRepository remotePreferenceRepository;
//  @Mock private DefaultViewerPageRepository defaultViewerPageRepository;
//  @Mock private EmailUtil emailUtil;
//  @Mock private DozerBeanMapper mapper;
//  @Mock private AuthUtil authUtil;
//  @Mock private ClientUtil clientUtil;
//  @Mock private HttpServletRequest httpServletRequest;
//
//  @Test
//  public void checkRemoteOrEmailExists_doesNotExist() {
//    Remote remote = Mocks.remote();
//
//    when(this.remoteRepository.findByEmail(eq(remote.getEmail()))).thenReturn(null);
//    when(this.remoteRepository.findByRemoteSubdomain(eq(remote.getRemoteSubdomain()))).thenReturn(null);
//
//    ResponseEntity<?> response = this.accountService.checkRemoteOrEmailExists(remote);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(204), response.getStatusCode());
//  }
//
//  @Test
//  public void checkRemoteOrEmailExists_emailDoesExist() {
//    Remote remote = Mocks.remote();
//
//    when(this.remoteRepository.findByEmail(eq(remote.getEmail()))).thenReturn(remote);
//
//    ResponseEntity<CheckExistsResponse> response = this.accountService.checkRemoteOrEmailExists(remote);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//    assertNotNull(response.getBody());
//    assertEquals("EMAIL_EXISTS", response.getBody().getStatus());
//  }
//
//  @Test
//  public void checkRemoteOrEmailExists_showDoesExist() {
//    Remote remote = Mocks.remote();
//
//    when(this.remoteRepository.findByRemoteSubdomain(eq(remote.getRemoteSubdomain()))).thenReturn(remote);
//
//    ResponseEntity<CheckExistsResponse> response = this.accountService.checkRemoteOrEmailExists(remote);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//    assertNotNull(response.getBody());
//    assertEquals("SHOW_EXISTS", response.getBody().getStatus());
//  }
//
//  @Test
//  public void signUp() {
//    Remote remote = Mocks.remote();
//    DefaultViewerPage defaultViewerPage = Mocks.defaultViewerPage();
//    RemoteResponse remoteResponse = Mocks.remoteResponse();
//    Response sendGridResponse = new Response();
//    sendGridResponse.setStatusCode(202);
//
//    when(this.authUtil.getBasicAuthCredentials(any(HttpServletRequest.class))).thenReturn(new String[]{remote.getEmail(), remote.getPassword()});
//    when(this.remoteRepository.findByEmailOrRemoteSubdomain(eq(remote.getEmail()), eq(remote.getRemoteSubdomain()))).thenReturn(null);
//    when(this.defaultViewerPageRepository.findFirstByIsVersionActive(eq(true))).thenReturn(defaultViewerPage);
//    when(this.remoteRepository.save(any(Remote.class))).thenReturn(remote);
//    when(this.mapper.map(eq(remote), eq(RemoteResponse.class))).thenReturn(remoteResponse);
//    when(this.emailUtil.sendEmail(eq(remote), eq(null), eq(null), eq(EmailTemplate.VERIFICATION))).thenReturn(sendGridResponse);
//
//    ResponseEntity<RemoteResponse> response = this.accountService.signUp(remote, httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//    assertNotNull(response.getBody());
//    assertEquals(remoteResponse, response.getBody());
//
//    verify(emailUtil, times(1)).sendEmail(any(Remote.class), eq(null), eq(null), eq(EmailTemplate.VERIFICATION));
//    verify(remotePreferenceRepository, times(1)).save(any(RemotePreference.class));
//  }
//
//  @Test
//  public void signUp_basicAuthMissing() {
//    Remote remote = Mocks.remote();
//
//    when(this.authUtil.getBasicAuthCredentials(any(HttpServletRequest.class))).thenReturn(null);
//
//    ResponseEntity<RemoteResponse> response = this.accountService.signUp(remote, httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(400), response.getStatusCode());
//    assertNull(response.getBody());
//  }
//
//  @Test
//  public void signUp_accountExists() {
//    Remote remote = Mocks.remote();
//
//    when(this.authUtil.getBasicAuthCredentials(any(HttpServletRequest.class))).thenReturn(new String[]{remote.getEmail(), remote.getPassword()});
//    when(this.remoteRepository.findByEmailOrRemoteSubdomain(eq(remote.getEmail()), eq(remote.getRemoteSubdomain()))).thenReturn(remote);
//
//    ResponseEntity<RemoteResponse> response = this.accountService.signUp(remote, httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//    assertNull(response.getBody());
//  }
//
//  @Test
//  public void signIn() {
//    Remote request = Mocks.remote();
//    Remote remote = Mocks.remote();
//    remote.setPassword("$2a$10$13H52SG1HDtiaJm9Q1ZxYOrtruKD7aVnXE62QLyrKfdxuv.voWQ9.");
//
//    when(this.authUtil.getBasicAuthCredentials(any(HttpServletRequest.class))).thenReturn(new String[]{request.getEmail(), request.getPassword()});
//    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn("127.0.0.1");
//    when(this.remoteRepository.findByEmail(eq(request.getEmail()))).thenReturn(remote);
//    when(this.authUtil.signJwt(eq(remote))).thenReturn("jwtToken");
//    when(this.mapper.map(remote, RemoteResponse.class)).thenReturn(new RemoteResponse());
//
//    ResponseEntity<RemoteResponse> response = this.accountService.signIn(httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//    assertNotNull(response.getBody());
//  }
//
//  @Test
//  public void signIn_basicAuthMissing() {
//    Remote remote = Mocks.remote();
//
//    when(this.authUtil.getBasicAuthCredentials(any(HttpServletRequest.class))).thenReturn(null);
//
//    ResponseEntity<RemoteResponse> response = this.accountService.signIn(httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//    assertNull(response.getBody());
//  }
//
//  @Test
//  public void signIn_accountNotFound() {
//    Remote remote = Mocks.remote();
//
//    when(this.authUtil.getBasicAuthCredentials(any(HttpServletRequest.class))).thenReturn(new String[]{remote.getEmail(), remote.getPassword()});
//    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn("127.0.0.1");
//    when(this.remoteRepository.findByEmail(eq(remote.getEmail()))).thenReturn(null);
//
//    ResponseEntity<RemoteResponse> response = this.accountService.signIn(httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//    assertNull(response.getBody());
//  }
//
//  @Test
//  public void signIn_emailNotVerified() {
//    Remote remote = Mocks.remote();
//    remote.setEmailVerified(false);
//
//    when(this.authUtil.getBasicAuthCredentials(any(HttpServletRequest.class))).thenReturn(new String[]{remote.getEmail(), remote.getPassword()});
//    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn("127.0.0.1");
//    when(this.remoteRepository.findByEmail(eq(remote.getEmail()))).thenReturn(remote);
//
//    ResponseEntity<RemoteResponse> response = this.accountService.signIn(httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//    assertNull(response.getBody());
//  }
//
//  @Test
//  public void signIn_passwordDoesNotMatch() {
//    Remote remote = Mocks.remote();
//
//    when(this.authUtil.getBasicAuthCredentials(any(HttpServletRequest.class))).thenReturn(new String[]{remote.getEmail(), remote.getPassword()});
//    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn("127.0.0.1");
//    when(this.remoteRepository.findByEmail(eq(remote.getEmail()))).thenReturn(remote);
//
//    ResponseEntity<RemoteResponse> response = this.accountService.signIn(httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//    assertNull(response.getBody());
//  }
//
//  @Test
//  public void requestResetPassword() {
//    PasswordReset request = Mocks.passwordReset();
//    Remote remote = Mocks.remote();
//    Response sendGridResponse = new Response();
//    sendGridResponse.setStatusCode(202);
//
//    when(this.remoteRepository.findByEmail(eq(request.getEmail()))).thenReturn(remote);
//    when(this.emailUtil.sendEmail(eq(remote), eq(request), eq(null), eq(EmailTemplate.FORGOT_PASSWORD))).thenReturn(sendGridResponse);
//
//    ResponseEntity<?> response = this.accountService.requestResetPassword(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//
//    verify(passwordResetRepository, times(1)).deleteByEmail(remote.getEmail());
//    verify(passwordResetRepository, times(1)).save(request);
//    verify(emailUtil, times(1)).sendEmail(eq(remote), eq(request), eq(null), eq(EmailTemplate.FORGOT_PASSWORD));
//  }
//
//  @Test
//  public void requestResetPassword_emailNotFound() {
//    PasswordReset request = Mocks.passwordReset();
//
//    when(this.remoteRepository.findByEmail(eq(request.getEmail()))).thenReturn(null);
//
//    ResponseEntity<?> response = this.accountService.requestResetPassword(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//  }
//
//  @Test
//  public void resendVerificationEmail() {
//    Remote request = Mocks.remote();
//    Remote remote = Mocks.remote();
//
//    when(this.remoteRepository.findByEmail(eq(request.getEmail()))).thenReturn(remote);
//
//    ResponseEntity<?> response = this.accountService.resendVerificationEmail(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//
//    verify(emailUtil, times(1)).sendEmail(eq(remote), eq(null), eq(null), eq(EmailTemplate.VERIFICATION));
//  }
//
//  @Test
//  public void resendVerificationEmail_emailNotFound() {
//    Remote request = Mocks.remote();
//
//    when(this.remoteRepository.findByEmail(eq(request.getEmail()))).thenReturn(null);
//
//    ResponseEntity<?> response = this.accountService.resendVerificationEmail(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//  }
//
//  @Test
//  public void verifyEmail() {
//    Remote request = Mocks.remote();
//    Remote remote = Mocks.remote();
//
//    when(this.remoteRepository.findByRemoteToken(request.getRemoteToken())).thenReturn(remote);
//
//    ResponseEntity<?> response = this.accountService.verifyEmail(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//
//    verify(remoteRepository, times(1)).save(remote);
//  }
//
//  @Test
//  public void verifyEmail_accountNotFound() {
//    Remote request = Mocks.remote();
//
//    when(this.remoteRepository.findByRemoteToken(request.getRemoteToken())).thenReturn(null);
//
//    ResponseEntity<?> response = this.accountService.verifyEmail(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//  }
//
//  @Test
//  public void verifyResetPasswordLink() {
//    PasswordReset request = Mocks.passwordReset();
//    Remote remote = Mocks.remote();
//
//    when(this.passwordResetRepository.findByPasswordResetLinkAndPasswordResetExpiryGreaterThan(eq(request.getPasswordResetLink()), any(ZonedDateTime.class))).thenReturn(request);
//    when(this.remoteRepository.findByRemoteToken(request.getRemoteToken())).thenReturn(remote);
//    when(this.authUtil.signJwt(remote)).thenReturn("jwtToken");
//
//    ResponseEntity<String> response = this.accountService.verifyResetPasswordLink(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//    assertNotNull(response.getBody());
//    assertEquals("jwtToken", response.getBody());
//  }
//
//  @Test
//  public void verifyResetPasswordLink_linkNotFound() {
//    PasswordReset request = Mocks.passwordReset();
//
//    when(this.passwordResetRepository.findByPasswordResetLinkAndPasswordResetExpiryGreaterThan(eq(request.getPasswordResetLink()), any(ZonedDateTime.class))).thenReturn(null);
//
//    ResponseEntity<String> response = this.accountService.verifyResetPasswordLink(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//  }
//
//  @Test
//  public void checkRemoteTokenExists() {
//    Remote request = Mocks.remote();
//    Remote remote = Mocks.remote();
//
//    when(this.remoteRepository.findByRemoteToken(request.getRemoteToken())).thenReturn(remote);
//
//    ResponseEntity<?> response = this.accountService.checkRemoteTokenExists(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//  }
//
//  @Test
//  public void checkRemoteTokenExists_tokenDoesNotExist() {
//    Remote request = Mocks.remote();
//
//    when(this.remoteRepository.findByRemoteToken(request.getRemoteToken())).thenReturn(null);
//
//    ResponseEntity<?> response = this.accountService.checkRemoteTokenExists(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(204), response.getStatusCode());
//  }
//
//  @Test
//  public void resetPassword() {
//    TokenDTO tokenDTO = Mocks.tokenDTO();
//    Remote remote = Mocks.remote();
//    PasswordReset passwordReset = Mocks.passwordReset();
//
//    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
//    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getShowToken()))).thenReturn(remote);
//    when(this.passwordResetRepository.findByRemoteToken(eq(tokenDTO.getShowToken()))).thenReturn(passwordReset);
//    when(this.authUtil.getPasswordFromHeader(any(HttpServletRequest.class))).thenReturn("newPassword");
//
//    ResponseEntity<?> response = this.accountService.resetPassword(httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//
//    verify(remoteRepository, times(1)).save(remote);
//    verify(passwordResetRepository, times(1)).delete(passwordReset);
//  }
//
//  @Test
//  public void resetPassword_accountNotFound() {
//    TokenDTO tokenDTO = Mocks.tokenDTO();
//
//    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
//    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getShowToken()))).thenReturn(null);
//
//    ResponseEntity<?> response = this.accountService.resetPassword(httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//  }
//
//  @Test
//  public void resetPassword_passwordIsNull() {
//    TokenDTO tokenDTO = Mocks.tokenDTO();
//    Remote remote = Mocks.remote();
//
//    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
//    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getShowToken()))).thenReturn(remote);
//    when(this.authUtil.getPasswordFromHeader(any(HttpServletRequest.class))).thenReturn(null);
//
//    ResponseEntity<?> response = this.accountService.resetPassword(httpServletRequest);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(400), response.getStatusCode());
//  }
//
//  @Test
//  public void forgotPassword() {
//
//    PasswordReset request = Mocks.passwordReset();
//    Remote remote = Mocks.remote();
//    Response sendGridResponse = new Response();
//    sendGridResponse.setStatusCode(202);
//
//    when(this.remoteRepository.findByEmail(eq(request.getEmail()))).thenReturn(remote);
//    when(this.emailUtil.sendEmail(eq(remote), eq(request), eq(null), eq(EmailTemplate.FORGOT_PASSWORD))).thenReturn(sendGridResponse);
//
//    ResponseEntity<?> response = this.accountService.forgotPassword(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//
//    verify(passwordResetRepository, times(1)).deleteByEmail(remote.getEmail());
//    verify(passwordResetRepository, times(1)).save(request);
//    verify(emailUtil, times(1)).sendEmail(eq(remote), eq(request), eq(null), eq(EmailTemplate.FORGOT_PASSWORD));
//  }
//
//  @Test
//  public void forgotPassword_noEmailFound() {
//
//    PasswordReset request = Mocks.passwordReset();
//    Remote remote = Mocks.remote();
//    Response sendGridResponse = new Response();
//    sendGridResponse.setStatusCode(202);
//
//    when(this.remoteRepository.findByEmail(eq(request.getEmail()))).thenReturn(null);
//
//    ResponseEntity<?> response = this.accountService.forgotPassword(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
//
//    verify(passwordResetRepository, times(0)).deleteByEmail(remote.getEmail());
//    verify(passwordResetRepository, times(0)).save(request);
//    verify(emailUtil, times(0)).sendEmail(eq(remote), eq(request), eq(null), eq(EmailTemplate.FORGOT_PASSWORD));
//  }
//}
