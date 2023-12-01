package com.remotefalcon.api.service;

import com.remotefalcon.api.Mocks;
import com.remotefalcon.api.dto.TokenDTO;
import com.remotefalcon.api.entity.*;
import com.remotefalcon.api.enums.EmailTemplate;
import com.remotefalcon.api.repository.*;
import com.remotefalcon.api.request.ActiveThemeRequest;
import com.remotefalcon.api.request.CustomLocationRequest;
import com.remotefalcon.api.request.SequenceKeyRequest;
import com.remotefalcon.api.request.UpdateShowName;
import com.remotefalcon.api.request.ViewerPagePublicRequest;
import com.remotefalcon.api.response.PublicViewerPagesResponse;
import com.remotefalcon.api.response.RemoteResponse;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.EmailUtil;
import com.sendgrid.Response;
import org.dozer.DozerBeanMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ControlPanelServiceTest {
  
  @InjectMocks ControlPanelService controlPanelService;

  @Mock private RemoteRepository remoteRepository;
  @Mock private RemotePreferenceRepository remotePreferenceRepository;
  @Mock private ViewerPageStatsRepository viewerPageStatsRepository;
  @Mock private ViewerJukeStatsRepository viewerJukeStatsRepository;
  @Mock private ViewerVoteStatsRepository viewerVoteStatsRepository;
  @Mock private ViewerVoteWinStatsRepository viewerVoteWinStatsRepository;
  @Mock private ActiveViewerRepository activeViewerRepository;
  @Mock private ExternalApiAccessRepository externalApiAccessRepository;
  @Mock private PlaylistRepository playlistRepository;
  @Mock private RemoteJukeRepository remoteJukeRepository;
  @Mock private RemoteViewerVoteRepository remoteViewerVoteRepository;
  @Mock private ViewerPageMetaRepository viewerPageMetaRepository;
  @Mock private PageGalleryHeartsRepository pageGalleryHeartsRepository;
  @Mock private DefaultViewerPageRepository defaultViewerPageRepository;
  @Mock private CurrentPlaylistRepository currentPlaylistRepository;
  @Mock private FppScheduleRepository fppScheduleRepository;
  @Mock private PasswordResetRepository passwordResetRepository;
  @Mock private PluginService pluginService;
  @Mock private AuthUtil authUtil;
  @Mock private DozerBeanMapper mapper;
  @Mock private EmailUtil emailUtil;
  @Mock private HttpServletRequest httpServletRequest;
  @Mock private PlaylistGroupRepository playlistGroupRepository;
  @Mock private PsaSequenceRepository psaSequenceRepository;
  @Mock private RemoteViewerPagesRepository remoteViewerPagesRepository;

  @Test
  public void coreInfo() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Remote remote = Mocks.remote();
    RemoteResponse remoteResponse = Mocks.remoteResponse();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remote);
    when(this.mapper.map(eq(remote), eq(RemoteResponse.class))).thenReturn(remoteResponse);

    ResponseEntity<RemoteResponse> response = this.controlPanelService.coreInfo();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("abc123", response.getBody().getRemoteToken());
  }

  @Test
  public void deleteViewerStats() {
    TokenDTO tokenDTO = Mocks.tokenDTO();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);

    ResponseEntity<?> response = this.controlPanelService.deleteViewerStats();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(viewerPageStatsRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(viewerJukeStatsRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(viewerVoteStatsRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(viewerVoteWinStatsRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
  }

  @Test
  public void updateActiveTheme() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Remote remote = Mocks.remote();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remote);

    ResponseEntity<?> response = this.controlPanelService.updateActiveTheme(ActiveThemeRequest.builder().activeTheme("light").build());
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteRepository, times(1)).save(remote);
  }

  @Test
  public void updatePassword() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Remote remote = Mocks.remote();
    remote.setPassword("$2a$10$13H52SG1HDtiaJm9Q1ZxYOrtruKD7aVnXE62QLyrKfdxuv.voWQ9.");

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remote);
    when(this.authUtil.getPasswordFromHeader(any(HttpServletRequest.class))).thenReturn("password");
    when(this.authUtil.getUpdatedPasswordFromHeader(any(HttpServletRequest.class))).thenReturn("newPassword");

    ResponseEntity<?> response = this.controlPanelService.updatePassword(httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteRepository, times(1)).save(remote);
  }

  @Test
  public void updatePassword_accountNotFound() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Remote remote = Mocks.remote();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(null);

    ResponseEntity<?> response = this.controlPanelService.updatePassword(httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(400), response.getStatusCode());
  }

  @Test
  public void updateShowName() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Remote remote = Mocks.remote();
    UpdateShowName updateShowName = Mocks.updateShowName();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remote);

    ResponseEntity<?> response = this.controlPanelService.updateShowName(updateShowName);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteRepository, times(1)).save(remote);
  }

  @Test
  public void updateShowName_accountNotFound() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Remote remote = Mocks.remote();
    UpdateShowName updateShowName = Mocks.updateShowName();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(null);

    ResponseEntity<?> response = this.controlPanelService.updateShowName(updateShowName);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(400), response.getStatusCode());
  }

  @Test
  public void requestApiAccess() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Remote remote = Mocks.remote();
    ExternalApiAccess externalApiAccess = Mocks.externalApiAccess();
    Response sendGridResponse = new Response();
    sendGridResponse.setStatusCode(202);

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remote);
    when(this.externalApiAccessRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(null);
    when(this.emailUtil.sendEmail(eq(remote), eq(null), any(), eq(EmailTemplate.REQUEST_API_ACCESS))).thenReturn(sendGridResponse);

    ResponseEntity<?> response = this.controlPanelService.requestApiAccess();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(externalApiAccessRepository, times(1)).save(any(ExternalApiAccess.class));
    verify(emailUtil, times(1)).sendEmail(any(Remote.class), eq(null), any(ExternalApiAccess.class), eq(EmailTemplate.REQUEST_API_ACCESS));
  }

  @Test
  public void requestApiAccess_hasAccess() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Remote remote = Mocks.remote();
    ExternalApiAccess externalApiAccess = Mocks.externalApiAccess();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remote);
    when(this.externalApiAccessRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(externalApiAccess);

    ResponseEntity<?> response = this.controlPanelService.requestApiAccess();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(204), response.getStatusCode());
  }

  @Test
  public void deleteAccount() {
    TokenDTO tokenDTO = Mocks.tokenDTO();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);

    ResponseEntity<?> response = this.controlPanelService.deleteAccount();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(activeViewerRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(currentPlaylistRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(externalApiAccessRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(fppScheduleRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(pageGalleryHeartsRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(passwordResetRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(playlistRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(remoteJukeRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(remotePreferenceRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(remoteRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(viewerJukeStatsRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(viewerPageMetaRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(viewerPageStatsRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(viewerVoteStatsRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
    verify(viewerVoteWinStatsRepository, times(1)).deleteAllByRemoteToken(tokenDTO.getRemoteToken());
  }

  @Test
  public void remotePrefs() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    List<PsaSequence> psaSequenceList = Mocks.psaSequenceList();
    List<RemoteViewerPages> remoteViewerPages = Mocks.remoteViewerPages();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.psaSequenceRepository.findAllByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(psaSequenceList);
    when(this.remoteViewerPagesRepository.findAllByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remoteViewerPages);

    ResponseEntity<RemotePreference> response = this.controlPanelService.remotePrefs();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertNotNull(response.getBody().getPsaSequenceList());
    assertEquals(2, response.getBody().getPsaSequenceList().size());
  }

  @Test
  public void remotePrefs_noPrefs() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    List<RemoteViewerPages> remoteViewerPages = Mocks.remoteViewerPages();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(null);
    when(this.psaSequenceRepository.findAllByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(null);
    when(this.remoteViewerPagesRepository.findAllByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remoteViewerPages);

    ResponseEntity<RemotePreference> response = this.controlPanelService.remotePrefs();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(400), response.getStatusCode());
  }

  @Test
  public void sequences() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    List<Playlist> sequences = Mocks.sequences();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.playlistRepository.findAllByRemoteTokenOrderBySequenceOrderAsc(eq(tokenDTO.getRemoteToken()))).thenReturn(sequences);

    ResponseEntity<List<Playlist>> response = this.controlPanelService.sequences();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(3, response.getBody().size());
  }

  @Test
  public void currentQueueDepth() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteJukeRepository.findAllByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remoteJukeList);

    ResponseEntity<Integer> response = this.controlPanelService.currentQueueDepth();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(3, response.getBody().intValue());
  }

  @Test
  public void customLocation() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    CustomLocationRequest customLocationRequest = Mocks.customLocationRequest();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remotePreference);

    ResponseEntity<?> response = this.controlPanelService.customLocation(customLocationRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remotePreferenceRepository, times(1)).save(remotePreference);
  }

  @Test
  public void customLocation_noPrefs() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    CustomLocationRequest customLocationRequest = Mocks.customLocationRequest();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(null);

    ResponseEntity<?> response = this.controlPanelService.customLocation(customLocationRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(400), response.getStatusCode());

    verify(remotePreferenceRepository, times(0)).save(any(RemotePreference.class));
  }

  @Test
  public void saveRemotePrefs() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    List<PsaSequence> psaSequenceList = Mocks.psaSequenceList();
    remotePreference.setPsaSequenceList(psaSequenceList);
    remotePreference.setManagePsa(true);

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remotePreference);

    ResponseEntity<?> response = this.controlPanelService.saveRemotePrefs(remotePreference);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remotePreferenceRepository, times(1)).save(remotePreference);
  }

  @Test
  public void saveRemotePrefs_noPrefs() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(null);

    ResponseEntity<?> response = this.controlPanelService.saveRemotePrefs(remotePreference);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(400), response.getStatusCode());

    verify(remotePreferenceRepository, times(0)).save(any(RemotePreference.class));
  }

  @Test
  public void allJukeboxRequests() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(tokenDTO.getRemoteToken()))).thenReturn(remoteJukeList);

    ResponseEntity<List<RemoteJuke>> response = this.controlPanelService.allJukeboxRequests();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(3, response.getBody().size());
    assertEquals("Sequence One", response.getBody().get(0).getNextPlaylist());
    assertEquals("Sequence Two", response.getBody().get(1).getNextPlaylist());
  }

  @Test
  public void allJukeboxRequests_onlyOneSequence() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();
    remoteJukeList = remoteJukeList.stream().findFirst().stream().toList();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(tokenDTO.getRemoteToken()))).thenReturn(remoteJukeList);

    ResponseEntity<List<RemoteJuke>> response = this.controlPanelService.allJukeboxRequests();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(1, response.getBody().size());
    assertEquals("Sequence One", response.getBody().get(0).getNextPlaylist());
  }

  @Test
  public void purgeQueue() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(tokenDTO.getRemoteToken())).thenReturn(remotePreference);

    ResponseEntity<?> response = this.controlPanelService.purgeQueue();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteJukeRepository, times(1)).deleteByRemoteToken(tokenDTO.getRemoteToken());
  }

  @Test
  public void deleteJukeboxRequest_future() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Long remoteJukeKey = (long) 2;
    RemoteJuke remoteJuke = Mocks.remoteJuke_future();

    when(this.remoteJukeRepository.findByRemoteJukeKey(eq(remoteJukeKey))).thenReturn(Optional.of(remoteJuke));

    ResponseEntity<?> response = this.controlPanelService.deleteJukeboxRequest(remoteJukeKey);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteJukeRepository, times(1)).delete(remoteJuke);
  }

  @Test
  public void deleteJukeboxRequest_next() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Long remoteJukeKey = (long) 1;
    RemoteJuke remoteJuke = Mocks.remoteJuke_next();

    when(this.remoteJukeRepository.findByRemoteJukeKey(eq(remoteJukeKey))).thenReturn(Optional.of(remoteJuke));

    ResponseEntity<?> response = this.controlPanelService.deleteJukeboxRequest(remoteJukeKey);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
  }

  @Test
  public void resetAllVotes() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    List<Playlist> sequences = Mocks.sequences();
    List<RemoteViewerVote> remoteViewerVotes = Mocks.remoteViewerVotes();
    List<PlaylistGroup> playlistGroupList = Mocks.playlistGroupList();
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(tokenDTO.getRemoteToken())).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceOrderAsc(eq(tokenDTO.getRemoteToken()), eq(true))).thenReturn(sequences);
    when(this.remoteViewerVoteRepository.findAllByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remoteViewerVotes);
    when(this.playlistGroupRepository.findAllByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(playlistGroupList);

    ResponseEntity<?> response = this.controlPanelService.resetAllVotes();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(playlistRepository, times(1)).saveAll(anyList());
    verify(playlistGroupRepository, times(1)).saveAll(anyList());
    verify(remoteViewerVoteRepository, times(1)).deleteAll(anyList());
  }

  @Test
  public void getViewerPageMeta() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    ViewerPageMeta viewerPageMeta = Mocks.viewerPageMeta();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.viewerPageMetaRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(viewerPageMeta);

    ResponseEntity<ViewerPageMeta> response = this.controlPanelService.getViewerPageMeta();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("title", response.getBody().getViewerPageTitle());
  }

  @Test
  public void saveViewerPageMeta() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    ViewerPageMeta viewerPageMeta = Mocks.viewerPageMeta();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.viewerPageMetaRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(viewerPageMeta);

    ResponseEntity<ViewerPageMeta> response = this.controlPanelService.saveViewerPageMeta(viewerPageMeta);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("title", response.getBody().getViewerPageTitle());

    verify(viewerPageMetaRepository, times(1)).save(viewerPageMeta);
  }

  @Test
  public void saveViewerPageMeta_noMetaExists() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    ViewerPageMeta viewerPageMeta = Mocks.viewerPageMeta();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.viewerPageMetaRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(null);

    ResponseEntity<ViewerPageMeta> response = this.controlPanelService.saveViewerPageMeta(viewerPageMeta);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("title", response.getBody().getViewerPageTitle());

    verify(viewerPageMetaRepository, times(1)).save(any(ViewerPageMeta.class));
  }

  @Test
  public void checkViewerPageModified_isModified() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    ViewerPageMeta viewerPageMeta = Mocks.viewerPageMeta();
    DefaultViewerPage defaultViewerPage = Mocks.defaultViewerPage();
    Remote remote = Mocks.remote();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.defaultViewerPageRepository.findFirstByIsVersionActive(eq(true))).thenReturn(defaultViewerPage);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remote);

    ResponseEntity<Boolean> response = this.controlPanelService.checkViewerPageModified();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertTrue(response.getBody());
  }

  @Test
  public void checkViewerPageModified_isNotModified() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    ViewerPageMeta viewerPageMeta = Mocks.viewerPageMeta();
    DefaultViewerPage defaultViewerPage = Mocks.defaultViewerPage();
    Remote remote = Mocks.remote();
    remote.setHtmlContent("htmlContent");

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.defaultViewerPageRepository.findFirstByIsVersionActive(eq(true))).thenReturn(defaultViewerPage);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remote);

    ResponseEntity<Boolean> response = this.controlPanelService.checkViewerPageModified();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertFalse(response.getBody());
  }

  @Test
  public void updateViewerPagePublic() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    ViewerPagePublicRequest viewerPagePublicRequest = Mocks.viewerPagePublicRequest();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remotePreference);

    ResponseEntity<?> response = this.controlPanelService.updateViewerPagePublic(viewerPagePublicRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remotePreferenceRepository, times(1)).save(remotePreference);
  }

  @Test
  public void getDefaultViewerPageContent() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    DefaultViewerPage defaultViewerPage = Mocks.defaultViewerPage();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.defaultViewerPageRepository.findFirstByIsVersionActive(eq(true))).thenReturn(defaultViewerPage);

    ResponseEntity<String> response = this.controlPanelService.getDefaultViewerPageContent();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("htmlContent", response.getBody());
  }

  @Test
  public void getViewerPageContent() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Remote remote = Mocks.remote();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remote);

    ResponseEntity<String> response = this.controlPanelService.getViewerPageContent();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("customHtmlContent", response.getBody());
  }

  @Test
  public void saveViewerPageContent() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Remote remote = Mocks.remote();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remote);

    ResponseEntity<?> response = this.controlPanelService.saveViewerPageContent(remote);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteRepository, times(1)).save(remote);
  }

  @Test
  public void toggleSequenceVisibility() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Playlist playlist = Mocks.sequence();
    SequenceKeyRequest sequenceKeyRequest = Mocks.sequenceKeyRequest();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.playlistRepository.findByRemoteTokenAndSequenceKey(eq(tokenDTO.getRemoteToken()), eq(playlist.getSequenceKey()))).thenReturn(playlist);

    ResponseEntity<?> response = this.controlPanelService.toggleSequenceVisibility(sequenceKeyRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(playlistRepository, times(1)).save(playlist);
  }

  @Test
  public void deleteSequence() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Playlist playlist = Mocks.sequence();
    Long sequenceKey = (long) 1;

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.playlistRepository.findByRemoteTokenAndSequenceKey(eq(tokenDTO.getRemoteToken()), eq(sequenceKey))).thenReturn(playlist);

    ResponseEntity<?> response = this.controlPanelService.deleteSequence(sequenceKey);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(playlistRepository, times(1)).delete(playlist);
  }

  @Test
  public void deleteSequence_nullSequence() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    Playlist playlist = Mocks.sequence();
    Long sequenceKey = (long) 1;

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.playlistRepository.findByRemoteTokenAndSequenceKey(eq(tokenDTO.getRemoteToken()), eq(sequenceKey))).thenReturn(null);

    ResponseEntity<?> response = this.controlPanelService.deleteSequence(sequenceKey);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(playlistRepository, times(0)).delete(playlist);
  }

  @Test
  public void playSequence_jukebox_noNextSequence() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    Playlist playlist = Mocks.sequence();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();
    RemoteJuke remoteJuke = Mocks.remoteJuke_next();
    SequenceKeyRequest sequenceKeyRequest = Mocks.sequenceKeyRequest();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findByRemoteTokenAndSequenceKey(eq(tokenDTO.getRemoteToken()), eq(playlist.getSequenceKey()))).thenReturn(playlist);
    when(this.remoteJukeRepository.findAllByRemoteTokenAndOwnerRequested(eq(tokenDTO.getRemoteToken()), eq(true))).thenReturn(Collections.emptyList());

    ResponseEntity<?> response = this.controlPanelService.playSequence(sequenceKeyRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteJukeRepository, times(1)).save(any(RemoteJuke.class));
  }

  @Test
  public void playSequence_jukebox_nextSequenceExists() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    Playlist playlist = Mocks.sequence();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();
    RemoteJuke remoteJuke = Mocks.remoteJuke_next();
    SequenceKeyRequest sequenceKeyRequest = Mocks.sequenceKeyRequest();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findByRemoteTokenAndSequenceKey(eq(tokenDTO.getRemoteToken()), eq(playlist.getSequenceKey()))).thenReturn(playlist);
    when(this.remoteJukeRepository.findAllByRemoteTokenAndOwnerRequested(eq(tokenDTO.getRemoteToken()), eq(true))).thenReturn(Collections.emptyList());

    ResponseEntity<?> response = this.controlPanelService.playSequence(sequenceKeyRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteJukeRepository, times(1)).save(any(RemoteJuke.class));
  }

  @Test
  public void playSequence_jukebox_ownerRequested() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    Playlist playlist = Mocks.sequence();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();
    SequenceKeyRequest sequenceKeyRequest = Mocks.sequenceKeyRequest();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findByRemoteTokenAndSequenceKey(eq(tokenDTO.getRemoteToken()), eq(playlist.getSequenceKey()))).thenReturn(playlist);
    when(this.remoteJukeRepository.findAllByRemoteTokenAndOwnerRequested(eq(tokenDTO.getRemoteToken()), eq(true))).thenReturn(remoteJukeList);

    ResponseEntity<?> response = this.controlPanelService.playSequence(sequenceKeyRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(204), response.getStatusCode());
  }

  @Test
  public void playSequence_voting() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setViewerControlMode("voting");
    Playlist playlist = Mocks.sequence();
    SequenceKeyRequest sequenceKeyRequest = Mocks.sequenceKeyRequest();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findByRemoteTokenAndSequenceKey(eq(tokenDTO.getRemoteToken()), eq(playlist.getSequenceKey()))).thenReturn(playlist);
    when(this.playlistRepository.findAllByRemoteTokenAndOwnerVoted(eq(tokenDTO.getRemoteToken()), eq(true))).thenReturn(Collections.emptyList());

    ResponseEntity<?> response = this.controlPanelService.playSequence(sequenceKeyRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(playlistRepository, times(1)).save(playlist);
  }

  @Test
  public void playSequence_voting_ownerRequested() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setViewerControlMode("voting");
    Playlist playlist = Mocks.sequence();
    List<Playlist> playlists = Mocks.sequences();
    SequenceKeyRequest sequenceKeyRequest = Mocks.sequenceKeyRequest();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findByRemoteTokenAndSequenceKey(eq(tokenDTO.getRemoteToken()), eq(playlist.getSequenceKey()))).thenReturn(playlist);
    when(this.playlistRepository.findAllByRemoteTokenAndOwnerVoted(eq(tokenDTO.getRemoteToken()), eq(true))).thenReturn(playlists);

    ResponseEntity<?> response = this.controlPanelService.playSequence(sequenceKeyRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(204), response.getStatusCode());
  }

  @Test
  public void updateSequenceOrder() {
    List<Playlist> playlists = Mocks.sequences();

    ResponseEntity<?> response = this.controlPanelService.updateSequenceOrder(playlists);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(playlistRepository, times(1)).saveAll(anyList());
  }

  @Test
  public void updateSequenceDetails() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceGroup("Group");
    List<PlaylistGroup> playlistGroupList = Mocks.playlistGroupList();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.playlistGroupRepository.findAllByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(playlistGroupList);

    ResponseEntity<?> response = this.controlPanelService.updateSequenceDetails(playlists);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(playlistRepository, times(1)).saveAll(anyList());
    verify(playlistGroupRepository, times(1)).save(any(PlaylistGroup.class));
  }

  @Test
  public void publicViewerPagesCount() {
    when(this.remotePreferenceRepository.countByViewerPagePublicTrue()).thenReturn(10);

    ResponseEntity<Integer> response = this.controlPanelService.publicViewerPagesCount();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(2, response.getBody().intValue());
  }

  @Test
  public void publicViewerPages() {
    Integer page = 0;
    int pageOffset = page * 8;
    List<Remote> remotes = Mocks.remotes();

    when(this.remoteRepository.findAllByViewerPagePublic(eq(pageOffset))).thenReturn(remotes);

    ResponseEntity<List<PublicViewerPagesResponse>> response = this.controlPanelService.publicViewerPages(page);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(2, response.getBody().size());
  }

  @Test
  public void viewerPagesHearted() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    List<PageGalleryHearts> pageGalleryHearts = Mocks.pageGalleryHeartsList();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.pageGalleryHeartsRepository.findAllByRemoteTokenAndViewerPageHeartedTrue(eq(tokenDTO.getRemoteToken()))).thenReturn(pageGalleryHearts);

    ResponseEntity<List<PageGalleryHearts>> response = this.controlPanelService.viewerPagesHearted();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(3, response.getBody().size());
  }

  @Test
  public void viewerPageHeartCounts() {
    List<PageGalleryHearts> pageGalleryHearts = Mocks.pageGalleryHeartsList();

    when(this.pageGalleryHeartsRepository.findAllByViewerPageHeartedTrue()).thenReturn(pageGalleryHearts);

    ResponseEntity<List<PageGalleryHearts>> response = this.controlPanelService.viewerPageHeartCounts();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(2, response.getBody().size());
  }

  @Test
  public void toggleViewerPageHeart() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    PageGalleryHearts pageGalleryHearts = Mocks.pageGalleryHearts();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.pageGalleryHeartsRepository.findByRemoteTokenAndViewerPage(eq(tokenDTO.getRemoteToken()), eq(pageGalleryHearts.getViewerPage()))).thenReturn(pageGalleryHearts);

    ResponseEntity<?> response = this.controlPanelService.toggleViewerPageHeart(pageGalleryHearts);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(pageGalleryHeartsRepository, times(1)).save(pageGalleryHearts);
  }

  @Test
  public void toggleViewerPageHeart_noHearts() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    PageGalleryHearts pageGalleryHearts = Mocks.pageGalleryHearts();

    when(this.authUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.pageGalleryHeartsRepository.findByRemoteTokenAndViewerPage(eq(tokenDTO.getRemoteToken()), eq(pageGalleryHearts.getViewerPage()))).thenReturn(null);

    ResponseEntity<?> response = this.controlPanelService.toggleViewerPageHeart(pageGalleryHearts);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(pageGalleryHeartsRepository, times(1)).save(any(PageGalleryHearts.class));
  }

  @Test
  public void getViewerPageBySubdomain() {
    String subdomain = "awesomeshow";
    Remote remote = Mocks.remote();

    when(this.remoteRepository.findByRemoteSubdomain(eq(subdomain))).thenReturn(remote);

    ResponseEntity<?> response = this.controlPanelService.getViewerPageBySubdomain(subdomain);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
  }

  @Test
  public void getViewerPageBySubdomain_doesNotExist() {
    String subdomain = "awesomeshow";

    when(this.remoteRepository.findByRemoteSubdomain(eq(subdomain))).thenReturn(null);

    ResponseEntity<?> response = this.controlPanelService.getViewerPageBySubdomain(subdomain);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(404), response.getStatusCode());
  }
}
