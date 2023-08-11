package com.remotefalcon.api.service;

import com.remotefalcon.api.Mocks;
import com.remotefalcon.api.dto.ViewerTokenDTO;
import com.remotefalcon.api.entity.*;
import com.remotefalcon.api.repository.*;
import com.remotefalcon.api.request.AddSequenceRequest;
import com.remotefalcon.api.request.ViewerPageVisitRequest;
import com.remotefalcon.api.response.AddSequenceResponse;
import com.remotefalcon.api.response.ViewerRemotePreferencesResponse;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.ClientUtil;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletRequest;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ViewerPageServiceTest {
  @InjectMocks ViewerPageService viewerPageService;

  @Mock private PlaylistRepository playlistRepository;
  @Mock private RemoteRepository remoteRepository;
  @Mock private RemotePreferenceRepository remotePreferenceRepository;
  @Mock private ActiveViewerRepository activeViewerRepository;
  @Mock private CurrentPlaylistRepository currentPlaylistRepository;
  @Mock private ViewerPageStatsRepository viewerPageStatsRepository;
  @Mock private ViewerPageMetaRepository viewerPageMetaRepository;
  @Mock private RemoteJukeRepository remoteJukeRepository;
  @Mock private ViewerVoteStatsRepository viewerVoteStatsRepository;
  @Mock private ViewerJukeStatsRepository viewerJukeStatsRepository;
  @Mock private RemoteViewerVoteRepository remoteViewerVoteRepository;
  @Mock private FppScheduleRepository fppScheduleRepository;
  @Mock private AuthUtil authUtil;
  @Mock private PsaSequenceRepository psaSequenceRepository;
  @Mock private ClientUtil clientUtil;
  @Mock private HttpServletRequest httpServletRequest;
  @Mock private PlaylistGroupRepository playlistGroupRepository;
  @Mock private RemoteViewerPagesRepository remoteViewerPagesRepository;

  @Test
  public void playlists() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceGroup("Group");
    playlists.get(1).setSequenceGroup("Group");
    List<PlaylistGroup> playlistGroupList = Mocks.playlistGroupList();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceOrderAsc(eq(viewerTokenDTO.getRemoteToken()), eq(true))).thenReturn(playlists);
    when(this.playlistGroupRepository.findAllByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(playlistGroupList);

    ResponseEntity<List<Playlist>> response = this.viewerPageService.playlists();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(2, response.getBody().size());
    assertEquals("Group", response.getBody().get(0).getSequenceName());
    assertEquals("Sequence Three", response.getBody().get(1).getSequenceName());
  }

  @Test
  public void playlists_voting() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setViewerControlMode("voting");
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceGroup("Group");
    playlists.get(1).setSequenceGroup("Group");
    List<PlaylistGroup> playlistGroupList = Mocks.playlistGroupList();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceOrderAsc(eq(viewerTokenDTO.getRemoteToken()), eq(true))).thenReturn(playlists);
    when(this.playlistGroupRepository.findAllByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(playlistGroupList);

    ResponseEntity<List<Playlist>> response = this.viewerPageService.playlists();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(2, response.getBody().size());
    assertEquals("Group", response.getBody().get(0).getSequenceName());
    assertEquals("Sequence Three", response.getBody().get(1).getSequenceName());
  }

  @Test
  public void playlists_voting_activeVotes() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setViewerControlMode("voting");
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceGroup("Group");
    playlists.get(1).setSequenceGroup("Group");
    playlists.get(2).setSequenceVotes(3);
    List<PlaylistGroup> playlistGroupList = Mocks.playlistGroupList();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceOrderAsc(eq(viewerTokenDTO.getRemoteToken()), eq(true))).thenReturn(playlists);
    when(this.playlistGroupRepository.findAllByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(playlistGroupList);

    ResponseEntity<List<Playlist>> response = this.viewerPageService.playlists();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(2, response.getBody().size());
    assertEquals("Sequence Three", response.getBody().get(0).getSequenceName());
    assertEquals("Group", response.getBody().get(1).getSequenceName());
  }

  @Test
  public void playlists_invalidToken() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<List<Playlist>> response = this.viewerPageService.playlists();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void viewerPageContents() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    List<RemoteViewerPages> remoteViewerPages = Mocks.remoteViewerPages();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remoteViewerPagesRepository.findFirstByRemoteTokenAndViewerPageActive(eq(viewerTokenDTO.getRemoteToken()), eq(true))).thenReturn(remoteViewerPages.stream().findFirst());

    ResponseEntity<String> response = this.viewerPageService.viewerPageContents();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("html", response.getBody());
  }

  @Test
  public void viewerPageContents_invalidToken() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<String> response = this.viewerPageService.viewerPageContents();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void remotePrefs() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    Remote remote = Mocks.remote();
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remoteRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remote);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);

    ResponseEntity<ViewerRemotePreferencesResponse> response = this.viewerPageService.remotePrefs();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("jukebox", response.getBody().getViewerControlMode());
  }

  @Test
  public void remotePrefs_invalidToken() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<ViewerRemotePreferencesResponse> response = this.viewerPageService.remotePrefs();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void updateActiveViewer() {
    String ipAddress = "127.0.0.2";
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    Remote remote = Mocks.remote();
    ActiveViewer activeViewer = Mocks.activeViewer();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn(ipAddress);
    when(this.remoteRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remote);
    when(this.activeViewerRepository.findFirstByRemoteTokenAndViewerIp(eq(viewerTokenDTO.getRemoteToken()), eq(ipAddress))).thenReturn(null);

    ResponseEntity<?> response = this.viewerPageService.updateActiveViewer(httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(activeViewerRepository, times(1)).save(any(ActiveViewer.class));
  }

  @Test
  public void updateActiveViewer_ipMatches() {
    String ipAddress = "127.0.0.1";
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    Remote remote = Mocks.remote();
    ActiveViewer activeViewer = Mocks.activeViewer();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn(ipAddress);
    when(this.remoteRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remote);

    ResponseEntity<?> response = this.viewerPageService.updateActiveViewer(httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
  }

  @Test
  public void updateActiveViewer_invalidToken() {
    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<?> response = this.viewerPageService.updateActiveViewer(httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void whatsPlaying() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();
    Playlist playlist = Mocks.sequence();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.currentPlaylistRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Optional.of(currentPlaylist));
    when(this.playlistRepository.findFirstByRemoteTokenAndSequenceName(eq(viewerTokenDTO.getRemoteToken()), eq(currentPlaylist.getCurrentPlaylist()))).thenReturn(Optional.of(playlist));

    ResponseEntity<String> response = this.viewerPageService.whatsPlaying();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Sequence One", response.getBody());
  }

  @Test
  public void whatsPlaying_nothing() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();
    Playlist playlist = Mocks.sequence();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.currentPlaylistRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Optional.empty());

    ResponseEntity<String> response = this.viewerPageService.whatsPlaying();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
  }

  @Test
  public void whatsPlaying_invalidToken() {
    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<String> response = this.viewerPageService.whatsPlaying();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void insertViewerPageStats() {
    String ipAddress = "127.0.0.2";
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    Remote remote = Mocks.remote();
    ViewerPageStats viewerPageStats = Mocks.viewerPageStats();
    ViewerPageVisitRequest viewerPageVisitRequest = Mocks.viewerPageVisitRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn(ipAddress);
    when(this.remoteRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remote);

    ResponseEntity<?> response = this.viewerPageService.insertViewerPageStats(viewerPageVisitRequest, httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(viewerPageStatsRepository, times(1)).save(any(ViewerPageStats.class));
  }

  @Test
  public void insertViewerPageStats_sameIp() {
    String ipAddress = "127.0.0.1";
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    Remote remote = Mocks.remote();
    ViewerPageStats viewerPageStats = Mocks.viewerPageStats();
    ViewerPageVisitRequest viewerPageVisitRequest = Mocks.viewerPageVisitRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn(ipAddress);
    when(this.remoteRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remote);

    ResponseEntity<?> response = this.viewerPageService.insertViewerPageStats(viewerPageVisitRequest, httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(204), response.getStatusCode());
  }

  @Test
  public void insertViewerPageStats_invalidToken() {
    ViewerPageVisitRequest viewerPageVisitRequest = Mocks.viewerPageVisitRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<?> response = this.viewerPageService.insertViewerPageStats(viewerPageVisitRequest, httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void getViewerPageMeta() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    ViewerPageMeta viewerPageMeta = Mocks.viewerPageMeta();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.viewerPageMetaRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(viewerPageMeta);

    ResponseEntity<ViewerPageMeta> response = this.viewerPageService.getViewerPageMeta();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("title", response.getBody().getViewerPageTitle());
  }

  @Test
  public void getViewerPageMeta_invalidToken() {
    ViewerPageMeta viewerPageMeta = Mocks.viewerPageMeta();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<ViewerPageMeta> response = this.viewerPageService.getViewerPageMeta();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void nextPlaylistInQueue_jukebox() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remoteJukes);

    ResponseEntity<String> response = this.viewerPageService.nextPlaylistInQueue();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Sequence One", response.getBody());
  }

  @Test
  public void nextPlaylistInQueue_voting() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setViewerControlMode("voting");
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceVotes(2);
    playlists.get(1).setSequenceVotes(1);

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(viewerTokenDTO.getRemoteToken()), eq(true))).thenReturn(playlists);

    ResponseEntity<String> response = this.viewerPageService.nextPlaylistInQueue();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Sequence One", response.getBody());
  }

  @Test
  public void nextPlaylistInQueue_noVotes() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setViewerControlMode("voting");
    List<Playlist> playlists = Mocks.sequences();
    FppSchedule fppSchedule = Mocks.fppSchedule();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(viewerTokenDTO.getRemoteToken()), eq(true))).thenReturn(playlists);
    when(this.fppScheduleRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Optional.of(fppSchedule));

    ResponseEntity<String> response = this.viewerPageService.nextPlaylistInQueue();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Scheduled Sequence", response.getBody());
  }

  @Test
  public void nextPlaylistInQueue_noSequence() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    FppSchedule fppSchedule = Mocks.fppSchedule();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Collections.emptyList());
    when(this.fppScheduleRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Optional.of(fppSchedule));

    ResponseEntity<String> response = this.viewerPageService.nextPlaylistInQueue();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Scheduled Sequence", response.getBody());
  }

  @Test
  public void nextPlaylistInQueue_invalidToken() {
    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<String> response = this.viewerPageService.nextPlaylistInQueue();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void currentQueueDepth() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remoteJukeRepository.findAllByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remoteJukes);

    ResponseEntity<Integer> response = this.viewerPageService.currentQueueDepth();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(3, response.getBody().intValue());
  }

  @Test
  public void currentQueueDepth_invalidToken() {
    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<Integer> response = this.viewerPageService.currentQueueDepth();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void allJukeboxRequests() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();
    Playlist playlist = Mocks.sequence();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remoteJukes);
    when(this.playlistRepository.findFirstByRemoteTokenAndSequenceName(eq(viewerTokenDTO.getRemoteToken()), anyString())).thenReturn(Optional.of(playlist));

    ResponseEntity<List<String>> response = this.viewerPageService.allJukeboxRequests();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(2, response.getBody().size());
  }

  @Test
  public void allJukeboxRequests_invalidToken() {
    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<List<String>> response = this.viewerPageService.allJukeboxRequests();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void addPlaylistToQueue() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();
    Playlist playlist = Mocks.sequence();
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remoteJukes);
    when(this.playlistRepository.findFirstByRemoteTokenAndSequenceName(eq(viewerTokenDTO.getRemoteToken()), anyString())).thenReturn(Optional.of(playlist));
    when(this.currentPlaylistRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Optional.empty());

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.addPlaylistToQueue(addSequenceRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteJukeRepository, times(1)).save(any(RemoteJuke.class));
    verify(viewerJukeStatsRepository, times(1)).save(any(ViewerJukeStats.class));
  }

  @Test
  public void addPlaylistToQueue_queueFull() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();
    remoteJukes.addAll(Mocks.remoteJukeList());
    Playlist playlist = Mocks.sequence();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remoteJukes);
    when(this.playlistRepository.findFirstByRemoteTokenAndSequenceName(eq(viewerTokenDTO.getRemoteToken()), anyString())).thenReturn(Optional.of(playlist));

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.addPlaylistToQueue(addSequenceRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(202), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("QUEUE_FULL", response.getBody().getMessage());
  }

  @Test
  public void addPlaylistToQueue_geoEnabled_validLocation() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setEnableGeolocation(true);
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();
    Playlist playlist = Mocks.sequence();
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remoteJukes);
    when(this.playlistRepository.findFirstByRemoteTokenAndSequenceName(eq(viewerTokenDTO.getRemoteToken()), anyString())).thenReturn(Optional.of(playlist));
    when(this.currentPlaylistRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Optional.empty());

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.addPlaylistToQueue(addSequenceRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteJukeRepository, times(1)).save(any(RemoteJuke.class));
    verify(viewerJukeStatsRepository, times(1)).save(any(ViewerJukeStats.class));
  }

  @Test
  public void addPlaylistToQueue_geoEnabled_invalidLocation() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setEnableGeolocation(true);
    remotePreference.setRemoteLatitude((float) 30.0);
    remotePreference.setRemoteLongitude((float) -90.0);
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();
    Playlist playlist = Mocks.sequence();
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remoteJukes);
    when(this.playlistRepository.findFirstByRemoteTokenAndSequenceName(eq(viewerTokenDTO.getRemoteToken()), anyString())).thenReturn(Optional.of(playlist));

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.addPlaylistToQueue(addSequenceRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(202), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("INVALID_LOCATION", response.getBody().getMessage());
  }

  @Test
  public void addPlaylistToQueue_songRequested() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setJukeboxRequestLimit(1);
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();
    Playlist playlist = Mocks.sequence();
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remoteJukes);
    when(this.playlistRepository.findFirstByRemoteTokenAndSequenceName(eq(viewerTokenDTO.getRemoteToken()), anyString())).thenReturn(Optional.of(playlist));

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.addPlaylistToQueue(addSequenceRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(202), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("SONG_REQUESTED", response.getBody().getMessage());
  }

  @Test
  public void addPlaylistToQueue_songRequestedAgain() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();
    Playlist playlist = Mocks.sequence();
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remoteJukes);
    when(this.playlistRepository.findFirstByRemoteTokenAndSequenceName(eq(viewerTokenDTO.getRemoteToken()), anyString())).thenReturn(Optional.of(playlist));
    when(this.currentPlaylistRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Optional.of(currentPlaylist));

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.addPlaylistToQueue(addSequenceRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(202), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("SONG_REQUESTED", response.getBody().getMessage());
  }

  @Test
  public void addPlaylistToQueue_noSequencesInQueue() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();
    Playlist playlist = Mocks.sequence();
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Collections.emptyList());
    when(this.currentPlaylistRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Optional.empty());

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.addPlaylistToQueue(addSequenceRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteJukeRepository, times(1)).save(any(RemoteJuke.class));
    verify(viewerJukeStatsRepository, times(1)).save(any(ViewerJukeStats.class));
  }

  @Test
  public void addPlaylistToQueue_psaEnabled() {
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setPsaEnabled(true);
    remotePreference.setPsaFrequency(1);
    List<RemoteJuke> remoteJukes = Mocks.remoteJukeList();
    Playlist playlist = Mocks.sequence();
    List<PsaSequence> psaSequenceList = Mocks.psaSequenceList();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remoteJukes);
    when(this.playlistRepository.findFirstByRemoteTokenAndSequenceName(eq(viewerTokenDTO.getRemoteToken()), anyString())).thenReturn(Optional.of(playlist));
    when(this.currentPlaylistRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Optional.empty());
    when(this.viewerJukeStatsRepository.countAllByRemoteTokenAndRequestDateTimeAfter(eq(viewerTokenDTO.getRemoteToken()), any(ZonedDateTime.class))).thenReturn(1);
    when(this.psaSequenceRepository.findFirstByRemoteTokenOrderByPsaSequenceLastPlayedAscPsaSequenceOrderAsc(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Optional.of(psaSequenceList.get(0)));

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.addPlaylistToQueue(addSequenceRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(remoteJukeRepository, times(2)).save(any(RemoteJuke.class));
    verify(viewerJukeStatsRepository, times(1)).save(any(ViewerJukeStats.class));
  }

  @Test
  public void addPlaylistToQueue_invalidToken() {
    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.addPlaylistToQueue(addSequenceRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Ignore
  public void voteForPlaylist() {
    String ipAddress = "127.0.0.2";
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    List<Playlist> playlists = Mocks.sequences();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn(ipAddress);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(playlists);

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.voteForPlaylist(addSequenceRequest, httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(playlistRepository, times(1)).save(any(Playlist.class));
    verify(viewerVoteStatsRepository, times(1)).save(any(ViewerVoteStats.class));
  }

  @Ignore
  public void voteForPlaylist_geoEnabled_validLocation() {
    String ipAddress = "127.0.0.2";
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setEnableGeolocation(true);
    List<Playlist> playlists = Mocks.sequences();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn(ipAddress);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(playlists);

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.voteForPlaylist(addSequenceRequest, httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(playlistRepository, times(1)).save(any(Playlist.class));
    verify(viewerVoteStatsRepository, times(1)).save(any(ViewerVoteStats.class));
  }

  @Test
  public void voteForPlaylist_geoEnabled_invalidLocation() {
    String ipAddress = "127.0.0.2";
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setEnableGeolocation(true);
    remotePreference.setRemoteLatitude((float) 30.0);
    remotePreference.setRemoteLongitude((float) -90.0);
    List<Playlist> playlists = Mocks.sequences();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn(ipAddress);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    //when(this.playlistRepository.findAllByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(playlists);

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.voteForPlaylist(addSequenceRequest, httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(202), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("INVALID_LOCATION", response.getBody().getMessage());

    verify(playlistRepository, times(0)).save(any(Playlist.class));
    verify(viewerVoteStatsRepository, times(0)).save(any(ViewerVoteStats.class));
  }

  @Ignore
  public void voteForPlaylist_checkIfVoted() {
    String ipAddress = "127.0.0.2";
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setCheckIfVoted(true);
    List<Playlist> playlists = Mocks.sequences();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn(ipAddress);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(playlists);
    when(this.remoteViewerVoteRepository.findByRemoteTokenAndViewerIp(eq(viewerTokenDTO.getRemoteToken()), eq(ipAddress))).thenReturn(Optional.empty());

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.voteForPlaylist(addSequenceRequest, httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());

    verify(playlistRepository, times(1)).save(any(Playlist.class));
    verify(viewerVoteStatsRepository, times(1)).save(any(ViewerVoteStats.class));
  }

  @Test
  public void voteForPlaylist_checkIfVoted_didVote() {
    String ipAddress = "127.0.0.2";
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setCheckIfVoted(true);
    List<Playlist> playlists = Mocks.sequences();
    RemoteViewerVote remoteViewerVote = Mocks.remoteViewerVote();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn(ipAddress);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    //when(this.playlistRepository.findAllByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(playlists);
    when(this.remoteViewerVoteRepository.findByRemoteTokenAndViewerIp(eq(viewerTokenDTO.getRemoteToken()), eq(ipAddress))).thenReturn(Optional.of(remoteViewerVote));

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.voteForPlaylist(addSequenceRequest, httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(202), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("ALREADY_VOTED", response.getBody().getMessage());

    verify(playlistRepository, times(0)).save(any(Playlist.class));
    verify(viewerVoteStatsRepository, times(0)).save(any(ViewerVoteStats.class));
  }

  @Test
  public void voteForPlaylist_playlistMissingForSomeReason() {
    String ipAddress = "127.0.0.2";
    ViewerTokenDTO viewerTokenDTO = Mocks.viewerTokenDTO();
    RemotePreference remotePreference = Mocks.remotePreference();
    List<Playlist> playlists = Mocks.sequences();
    RemoteViewerVote remoteViewerVote = Mocks.remoteViewerVote();

    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(viewerTokenDTO);
    when(this.clientUtil.getClientIp(any(HttpServletRequest.class))).thenReturn(ipAddress);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(remotePreference);
    //when(this.playlistRepository.findAllByRemoteToken(eq(viewerTokenDTO.getRemoteToken()))).thenReturn(Collections.emptyList());

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.voteForPlaylist(addSequenceRequest, httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(400), response.getStatusCode());
  }

  @Test
  public void voteForPlaylist_invalidToken() {
    AddSequenceRequest addSequenceRequest = Mocks.addSequenceRequest();

    when(this.authUtil.getViewerJwtPayload()).thenReturn(null);

    ResponseEntity<AddSequenceResponse> response = this.viewerPageService.voteForPlaylist(addSequenceRequest, httpServletRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }
}
