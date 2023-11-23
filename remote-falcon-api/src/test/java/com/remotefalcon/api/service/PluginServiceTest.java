package com.remotefalcon.api.service;

import com.remotefalcon.api.Mocks;
import com.remotefalcon.api.entity.*;
import com.remotefalcon.api.model.SyncPlaylistDetails;
import com.remotefalcon.api.repository.*;
import com.remotefalcon.api.request.*;
import com.remotefalcon.api.response.HighestVotedPlaylistResponse;
import com.remotefalcon.api.response.NextPlaylistResponse;
import com.remotefalcon.api.response.PluginResponse;
import com.remotefalcon.api.response.RemotePreferenceResponse;
import com.remotefalcon.api.util.AuthUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class PluginServiceTest {
  @InjectMocks PluginService pluginService;

  @Mock
  private RemoteRepository remoteRepository;
  @Mock private RemoteJukeRepository remoteJukeRepository;
  @Mock private RemotePreferenceRepository remotePreferenceRepository;
  @Mock private PlaylistRepository playlistRepository;
  @Mock private PlaylistGroupRepository playlistGroupRepository;
  @Mock private FppScheduleRepository fppScheduleRepository;
  @Mock private CurrentPlaylistRepository currentPlaylistRepository;
  @Mock private RemoteViewerVoteRepository remoteViewerVoteRepository;
  @Mock private ViewerVoteWinStatsRepository viewerVoteWinStatsRepository;
  @Mock private PsaSequenceRepository psaSequenceRepository;
  @Mock private AuthUtil authUtil;

  @Test
  public void nextPlaylistInQueue_updateQueue() {
    String remoteToken = "abc123";
    RemotePreference remotePreference = Mocks.remotePreference();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(1).setSequenceVisibleCount(2);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteToken(eq(remoteToken))).thenReturn(playlists);

    ResponseEntity<NextPlaylistResponse> response = this.pluginService.nextPlaylistInQueue(true);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
  }

  @Test
  public void nextPlaylistInQueue_updateQueue_playlistIsGrouped() {
    String remoteToken = "abc123";
    RemotePreference remotePreference = Mocks.remotePreference();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();
    List<Playlist> playlists = Mocks.sequences();
    List<PlaylistGroup> playlistGroups = Mocks.playlistGroupList();
    playlists.get(1).setSequenceVisibleCount(2);
    playlists.get(0).setSequenceGroup("Group");

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteToken(eq(remoteToken))).thenReturn(playlists);

    ResponseEntity<NextPlaylistResponse> response = this.pluginService.nextPlaylistInQueue(true);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
  }

  @Test
  public void nextPlaylistInQueue_doNotUpdateQueue() {
    String remoteToken = "abc123";
    RemotePreference remotePreference = Mocks.remotePreference();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(1).setSequenceVisibleCount(2);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteToken(eq(remoteToken))).thenReturn(playlists);

    ResponseEntity<NextPlaylistResponse> response = this.pluginService.nextPlaylistInQueue(false);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    verify(remoteJukeRepository, times(0)).save(remoteJukeList.get(0));
  }

  @Test
  public void nextPlaylistInQueue_oneSequenceInQueue() {
    String remoteToken = "abc123";
    RemotePreference remotePreference = Mocks.remotePreference();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();
    remoteJukeList = remoteJukeList.stream().findFirst().stream().toList();
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(1).setSequenceVisibleCount(2);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteToken(eq(remoteToken))).thenReturn(playlists);

    ResponseEntity<NextPlaylistResponse> response = this.pluginService.nextPlaylistInQueue(true);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
  }

  @Test
  public void nextPlaylistInQueue_noPlaylistInQueue() {
    String remoteToken = "abc123";
    RemotePreference remotePreference = Mocks.remotePreference();
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();
    List<Playlist> playlists = Mocks.sequences();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);
    when(this.playlistRepository.findAllByRemoteToken(eq(remoteToken))).thenReturn(playlists);

    ResponseEntity<NextPlaylistResponse> response = this.pluginService.nextPlaylistInQueue(true);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertNull(response.getBody().getNextPlaylist());
  }

  @Test
  public void updatePlaylistQueue() {
    String remoteToken = "abc123";
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();

    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(remoteToken))).thenReturn(remoteJukeList);

    ResponseEntity<PluginResponse> response = this.pluginService.updatePlaylistQueue(remoteToken);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Success", response.getBody().getMessage());
  }

  @Test
  public void updatePlaylistQueue_sequenceIsGrouped() {
    String remoteToken = "abc123";
    List<RemoteJuke> remoteJukeList = Mocks.remoteJukeList();
    List<PlaylistGroup> playlistGroups = Mocks.playlistGroupList();
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceGroup("Group");

    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(remoteToken))).thenReturn(remoteJukeList);

    ResponseEntity<PluginResponse> response = this.pluginService.updatePlaylistQueue(remoteToken);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Success", response.getBody().getMessage());
  }

  @Test
  public void updatePlaylistQueue_queueEmpty() {
    String remoteToken = "abc123";

    when(this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(eq(remoteToken))).thenReturn(Collections.emptyList());

    ResponseEntity<PluginResponse> response = this.pluginService.updatePlaylistQueue(remoteToken);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Queue Empty", response.getBody().getMessage());
  }

  @Test
  public void updatePlaylistQueue_noRemoteToken() {
    ResponseEntity<PluginResponse> response = this.pluginService.updatePlaylistQueue(null);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(401), response.getStatusCode());
  }

  @Test
  public void syncPlaylists_allNew() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    SyncPlaylistRequest syncPlaylistRequest = Mocks.syncPlaylistRequest();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenOrderBySequenceOrderAsc(eq(remoteToken))).thenReturn(playlists);
    when(this.psaSequenceRepository.findAllByRemoteToken(eq(remoteToken))).thenReturn(null);

    ResponseEntity<PluginResponse> response = this.pluginService.syncPlaylists(syncPlaylistRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Success", response.getBody().getMessage());

    verify(psaSequenceRepository, times(1)).findAllByRemoteToken(eq(remoteToken));
    verify(psaSequenceRepository, times(0)).delete(any(PsaSequence.class));
    verify(remotePreferenceRepository, times(0)).save(any(RemotePreference.class));
  }

  @Test
  public void syncPlaylists_someExisting() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    SyncPlaylistRequest syncPlaylistRequest = Mocks.syncPlaylistRequest();

    playlists.forEach(playlist -> syncPlaylistRequest.getPlaylists().add(SyncPlaylistDetails.builder()
                    .playlistName(playlist.getSequenceName())
                    .playlistType("SEQUENCE")
                    .playlistIndex(playlist.getSequenceIndex())
                    .playlistDuration(playlist.getSequenceDuration())
            .build()));

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenOrderBySequenceOrderAsc(eq(remoteToken))).thenReturn(playlists);
    when(this.psaSequenceRepository.findAllByRemoteToken(eq(remoteToken))).thenReturn(null);

    ResponseEntity<PluginResponse> response = this.pluginService.syncPlaylists(syncPlaylistRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Success", response.getBody().getMessage());

    verify(psaSequenceRepository, times(1)).findAllByRemoteToken(eq(remoteToken));
    verify(psaSequenceRepository, times(0)).delete(any(PsaSequence.class));
    verify(remotePreferenceRepository, times(0)).save(any(RemotePreference.class));
  }

  @Test
  public void syncPlaylists_psaRemoved() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    SyncPlaylistRequest syncPlaylistRequest = Mocks.syncPlaylistRequest();
    List<PsaSequence> psaSequenceList = Mocks.psaSequenceList();
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenOrderBySequenceOrderAsc(eq(remoteToken))).thenReturn(playlists);
    when(this.psaSequenceRepository.findAllByRemoteToken(eq(remoteToken))).thenReturn(psaSequenceList).thenReturn(null);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<PluginResponse> response = this.pluginService.syncPlaylists(syncPlaylistRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Success", response.getBody().getMessage());

    verify(psaSequenceRepository, times(2)).findAllByRemoteToken(eq(remoteToken));
    verify(psaSequenceRepository, times(2)).delete(any(PsaSequence.class));
    verify(remotePreferenceRepository, times(1)).save(any(RemotePreference.class));
  }

  @Test
  public void updateWhatsPlaying() {
    String remoteToken = "abc123";
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();
    UpdateWhatsPlayingRequest updateWhatsPlayingRequest = Mocks.updateWhatsPlayingRequest();
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceVisibleCount(1);
    List<PlaylistGroup> playlistGroups = Mocks.playlistGroupList();
    playlistGroups.get(0).setSequenceGroupVisibleCount(1);
    RemotePreference remotePreference = Mocks.remotePreference();

    List<Playlist> playlistsSavedForCounts = List.of(playlists.get(0));
    List<PlaylistGroup> playlistGroupsSavedForCounts = List.of(playlistGroups.get(0));

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.currentPlaylistRepository.findByRemoteToken(eq(remoteToken))).thenReturn(Optional.of(currentPlaylist));
    when(this.remotePreferenceRepository.findByRemoteToken(remoteToken)).thenReturn(remotePreference);

    ResponseEntity<PluginResponse> response = this.pluginService.updateWhatsPlaying(updateWhatsPlayingRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Sequence One", response.getBody().getCurrentPlaylist());

    verify(currentPlaylistRepository, times(1)).save(any(CurrentPlaylist.class));
  }

  @Test
  public void updateWhatsPlaying_managedPsa_normalSequence() {
    String remoteToken = "abc123";
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();
    UpdateWhatsPlayingRequest updateWhatsPlayingRequest = Mocks.updateWhatsPlayingRequest();
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceVisibleCount(1);
    List<PlaylistGroup> playlistGroups = Mocks.playlistGroupList();
    playlistGroups.get(0).setSequenceGroupVisibleCount(1);
    RemotePreference remotePreference = Mocks.remotePreference();
    List<PsaSequence> psaSequences = Mocks.psaSequenceList();

    List<Playlist> playlistsSavedForCounts = List.of(playlists.get(0));
    List<PlaylistGroup> playlistGroupsSavedForCounts = List.of(playlistGroups.get(0));
    remotePreference.setManagePsa(true);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.currentPlaylistRepository.findByRemoteToken(eq(remoteToken))).thenReturn(Optional.of(currentPlaylist));
    when(this.remotePreferenceRepository.findByRemoteToken(remoteToken)).thenReturn(remotePreference);

    ResponseEntity<PluginResponse> response = this.pluginService.updateWhatsPlaying(updateWhatsPlayingRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Sequence One", response.getBody().getCurrentPlaylist());

    verify(currentPlaylistRepository, times(1)).save(any(CurrentPlaylist.class));
  }

  @Test
  public void updateWhatsPlaying_managedPsa_psa() {
    String remoteToken = "abc123";
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();
    UpdateWhatsPlayingRequest updateWhatsPlayingRequest = Mocks.updateWhatsPlayingRequest();
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceVisibleCount(1);
    List<PlaylistGroup> playlistGroups = Mocks.playlistGroupList();
    playlistGroups.get(0).setSequenceGroupVisibleCount(1);
    RemotePreference remotePreference = Mocks.remotePreference();
    List<PsaSequence> psaSequences = Mocks.psaSequenceList();

    List<Playlist> playlistsSavedForCounts = List.of(playlists.get(0));
    List<PlaylistGroup> playlistGroupsSavedForCounts = List.of(playlistGroups.get(0));
    remotePreference.setManagePsa(true);
    remotePreference.setPsaEnabled(true);
    remotePreference.setPsaSequenceList(List.of(PsaSequence.builder().psaSequenceName("Sequence One").build()));
    remotePreference.setPsaFrequency(3);
    remotePreference.setSequencesPlayed(2);
    psaSequences.get(0).setPsaSequenceName("Sequence One");

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.currentPlaylistRepository.findByRemoteToken(eq(remoteToken))).thenReturn(Optional.of(currentPlaylist));
    when(this.remotePreferenceRepository.findByRemoteToken(remoteToken)).thenReturn(remotePreference);
    when(this.psaSequenceRepository.findAllByRemoteToken(remoteToken)).thenReturn(psaSequences);
    when(this.psaSequenceRepository.findFirstByRemoteTokenOrderByPsaSequenceLastPlayedAscPsaSequenceOrderAsc(remoteToken)).thenReturn(Optional.of(psaSequences.get(0)));

    ResponseEntity<PluginResponse> response = this.pluginService.updateWhatsPlaying(updateWhatsPlayingRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Sequence One", response.getBody().getCurrentPlaylist());

    verify(currentPlaylistRepository, times(1)).save(any(CurrentPlaylist.class));
  }

  @Test
  public void updateWhatsPlaying_managedPsa_psa_voting() {
    String remoteToken = "abc123";
    CurrentPlaylist currentPlaylist = Mocks.currentPlaylist();
    UpdateWhatsPlayingRequest updateWhatsPlayingRequest = Mocks.updateWhatsPlayingRequest();
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceVisibleCount(1);
    List<PlaylistGroup> playlistGroups = Mocks.playlistGroupList();
    playlistGroups.get(0).setSequenceGroupVisibleCount(1);
    RemotePreference remotePreference = Mocks.remotePreference();
    List<PsaSequence> psaSequences = Mocks.psaSequenceList();

    List<Playlist> playlistsSavedForCounts = List.of(playlists.get(0));
    List<PlaylistGroup> playlistGroupsSavedForCounts = List.of(playlistGroups.get(0));
    remotePreference.setViewerControlMode("VOTING");
    remotePreference.setManagePsa(true);
    remotePreference.setPsaEnabled(true);
    remotePreference.setPsaSequenceList(List.of(PsaSequence.builder().psaSequenceName("Sequence One").build()));
    remotePreference.setPsaFrequency(3);
    remotePreference.setSequencesPlayed(2);
    psaSequences.get(0).setPsaSequenceName("Sequence One");

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.currentPlaylistRepository.findByRemoteToken(eq(remoteToken))).thenReturn(Optional.of(currentPlaylist));
    when(this.remotePreferenceRepository.findByRemoteToken(remoteToken)).thenReturn(remotePreference);
    when(this.psaSequenceRepository.findAllByRemoteToken(remoteToken)).thenReturn(psaSequences);
    when(this.psaSequenceRepository.findFirstByRemoteTokenOrderByPsaSequenceLastPlayedAscPsaSequenceOrderAsc(remoteToken)).thenReturn(Optional.of(psaSequences.get(0)));

    ResponseEntity<PluginResponse> response = this.pluginService.updateWhatsPlaying(updateWhatsPlayingRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Sequence One", response.getBody().getCurrentPlaylist());

    verify(currentPlaylistRepository, times(1)).save(any(CurrentPlaylist.class));
  }

  @Test
  public void updateWhatsPlaying_noCurrentPlaylist() {
    String remoteToken = "abc123";
    UpdateWhatsPlayingRequest updateWhatsPlayingRequest = Mocks.updateWhatsPlayingRequest();
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.currentPlaylistRepository.findByRemoteToken(eq(remoteToken))).thenReturn(Optional.empty());
    when(this.remotePreferenceRepository.findByRemoteToken(remoteToken)).thenReturn(remotePreference);

    ResponseEntity<PluginResponse> response = this.pluginService.updateWhatsPlaying(updateWhatsPlayingRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Sequence One", response.getBody().getCurrentPlaylist());
    verify(currentPlaylistRepository, times(1)).save(any(CurrentPlaylist.class));
  }

  @Test
  public void updateWhatsPlaying_noPlaylist() {
    String remoteToken = "abc123";
    UpdateWhatsPlayingRequest updateWhatsPlayingRequest = Mocks.updateWhatsPlayingRequest();
    updateWhatsPlayingRequest.setPlaylist(null);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);

    ResponseEntity<PluginResponse> response = this.pluginService.updateWhatsPlaying(updateWhatsPlayingRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertNull(response.getBody().getCurrentPlaylist());
    verify(currentPlaylistRepository, times(1)).deleteByRemoteToken(remoteToken);
    verify(fppScheduleRepository, times(1)).deleteByRemoteToken(remoteToken);
    verify(currentPlaylistRepository, times(0)).save(any(CurrentPlaylist.class));
  }

  @Test
  public void updateNextScheduledSequence() {
    String remoteToken = "abc123";
    FppSchedule fppSchedule = Mocks.fppSchedule();
    UpdateNextScheduledRequest updateNextScheduledRequest = Mocks.updateNextScheduledRequest();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.fppScheduleRepository.findByRemoteToken(eq(remoteToken))).thenReturn(Optional.of(fppSchedule));

    ResponseEntity<PluginResponse> response = this.pluginService.updateNextScheduledSequence(updateNextScheduledRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Scheduled Sequence", response.getBody().getNextScheduledSequence());
    verify(fppScheduleRepository, times(1)).save(fppSchedule);
  }

  @Test
  public void updateNextScheduledSequence_newEntry() {
    String remoteToken = "abc123";
    FppSchedule fppSchedule = Mocks.fppSchedule();
    UpdateNextScheduledRequest updateNextScheduledRequest = Mocks.updateNextScheduledRequest();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.fppScheduleRepository.findByRemoteToken(eq(remoteToken))).thenReturn(Optional.empty());

    ResponseEntity<PluginResponse> response = this.pluginService.updateNextScheduledSequence(updateNextScheduledRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Scheduled Sequence", response.getBody().getNextScheduledSequence());
    verify(fppScheduleRepository, times(1)).save(any(FppSchedule.class));
  }

  @Test
  public void updateNextScheduledSequence_nothingNext() {
    String remoteToken = "abc123";
    FppSchedule fppSchedule = Mocks.fppSchedule();
    UpdateNextScheduledRequest updateNextScheduledRequest = Mocks.updateNextScheduledRequest();
    updateNextScheduledRequest.setSequence(null);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);

    ResponseEntity<PluginResponse> response = this.pluginService.updateNextScheduledSequence(updateNextScheduledRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertNull(response.getBody().getNextScheduledSequence());
    verify(fppScheduleRepository, times(0)).save(any(FppSchedule.class));
    verify(fppScheduleRepository, times(1)).deleteByRemoteToken(remoteToken);
  }

  @Test
  public void viewerControlMode() {
    String remoteToken = "abc123";
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<PluginResponse> response = this.pluginService.viewerControlMode();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("jukebox", response.getBody().getViewerControlMode());
  }

  @Test
  public void highestVotedPlaylist() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceVotes(3);
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(remoteToken), eq(true))).thenReturn(playlists);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<HighestVotedPlaylistResponse> response = this.pluginService.highestVotedPlaylist();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());

    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(remoteToken);
    verify(viewerVoteWinStatsRepository, times(1)).save(any(ViewerVoteWinStats.class));
    verify(playlistRepository, times(2)).saveAll(anyList());
    verify(playlistRepository, times(1)).save(any(Playlist.class));
  }

  @Test
  public void highestVotedPlaylist_resetVotes() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    List<PlaylistGroup> playlistGroups = Mocks.playlistGroupList();
    playlists.get(0).setSequenceVotes(3);
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setResetVotes(true);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(remoteToken), eq(true))).thenReturn(playlists);
    when(this.playlistGroupRepository.findAllByRemoteTokenOrderBySequenceGroupVotesDesc(eq(remoteToken))).thenReturn(playlistGroups);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<HighestVotedPlaylistResponse> response = this.pluginService.highestVotedPlaylist();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());

    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(remoteToken);
    verify(viewerVoteWinStatsRepository, times(1)).save(any(ViewerVoteWinStats.class));
    verify(playlistRepository, times(3)).saveAll(anyList());
    verify(playlistRepository, times(1)).save(any(Playlist.class));
  }

  @Test
  public void highestVotedPlaylist_resetVotes_groupWon() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    List<PlaylistGroup> playlistGroups = Mocks.playlistGroupList();
    playlistGroups.get(0).setSequenceGroupVotes(3);
    playlists.get(0).setSequenceGroup("Group");
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setResetVotes(true);

    List<Playlist> updatedPlaylists = Mocks.sequences();
    updatedPlaylists.get(0).setSequenceGroup("Group");
    updatedPlaylists.get(0).setSequenceVotes(22222);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(remoteToken), eq(true))).thenReturn(playlists).thenReturn(updatedPlaylists);
    when(this.playlistGroupRepository.findAllByRemoteTokenOrderBySequenceGroupVotesDesc(eq(remoteToken))).thenReturn(playlistGroups);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<HighestVotedPlaylistResponse> response = this.pluginService.highestVotedPlaylist();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());

    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(remoteToken);
    verify(viewerVoteWinStatsRepository, times(1)).save(any(ViewerVoteWinStats.class));
    verify(playlistRepository, times(3)).saveAll(anyList());
    verify(playlistRepository, times(1)).save(any(Playlist.class));
  }

  @Test
  public void highestVotedPlaylist_resetVotes_psaEnabled() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(2).setSequenceVotes(3);
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setResetVotes(true);
    remotePreference.setPsaEnabled(true);
    remotePreference.setPsaFrequency(1);
    List<PsaSequence> psaSequenceList = Mocks.psaSequenceList();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    //when(this.psaSequenceRepository.findAllByRemoteToken(eq(remoteToken))).thenReturn(psaSequenceList);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(remoteToken), eq(true))).thenReturn(playlists);
    //when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);
    //when(this.viewerVoteWinStatsRepository.countAllByRemoteTokenAndVoteWinDateTimeAfter(eq(remoteToken), any(ZonedDateTime.class))).thenReturn(1);
    //when(this.psaSequenceRepository.findFirstByRemoteTokenOrderByPsaSequenceLastPlayedAscPsaSequenceOrderAsc(eq(remoteToken))).thenReturn(Optional.of(psaSequenceList.get(0)));

    ResponseEntity<HighestVotedPlaylistResponse> response = this.pluginService.highestVotedPlaylist();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());

//    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(remoteToken);
//    verify(viewerVoteWinStatsRepository, times(0)).save(any(ViewerVoteWinStats.class));
//    verify(playlistRepository, times(2)).saveAll(anyList());
//    verify(playlistRepository, times(5)).save(any(Playlist.class));
//    verify(psaSequenceRepository, times(1)).save(any(PsaSequence.class));
  }

  @Test
  public void highestVotedPlaylist_hideSequence() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceVotes(3);
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setHideSequenceCount(3);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(remoteToken), eq(true))).thenReturn(playlists);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<HighestVotedPlaylistResponse> response = this.pluginService.highestVotedPlaylist();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(5, playlists.get(0).getSequenceVisibleCount().intValue());

    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(remoteToken);
    verify(viewerVoteWinStatsRepository, times(1)).save(any(ViewerVoteWinStats.class));
    verify(playlistRepository, times(2)).saveAll(anyList());
    verify(playlistRepository, times(2)).save(any(Playlist.class));
  }

  @Test
  public void highestVotedPlaylist_hideSequence_playlistIsGrouped() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    List<PlaylistGroup> playlistGroups = Mocks.playlistGroupList();
    playlists.get(0).setSequenceVotes(3);
    playlists.get(0).setSequenceGroup("Group");
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setHideSequenceCount(3);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(remoteToken), eq(true))).thenReturn(playlists);
    when(this.playlistGroupRepository.findAllByRemoteTokenOrderBySequenceGroupVotesDesc(eq(remoteToken))).thenReturn(playlistGroups);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<HighestVotedPlaylistResponse> response = this.pluginService.highestVotedPlaylist();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(0, playlists.get(0).getSequenceVisibleCount().intValue());
    assertEquals(0, playlistGroups.get(0).getSequenceGroupVisibleCount().intValue());

    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(remoteToken);
    verify(viewerVoteWinStatsRepository, times(0)).save(any(ViewerVoteWinStats.class));
    verify(playlistRepository, times(1)).saveAll(anyList());
    verify(playlistRepository, times(1)).save(any(Playlist.class));
  }

  @Test
  public void highestVotedPlaylist_hideSequence_groupWon() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    List<PlaylistGroup> playlistGroups = Mocks.playlistGroupList();
    playlistGroups.get(0).setSequenceGroupVotes(3);
    playlists.get(0).setSequenceGroup("Group");
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setHideSequenceCount(3);

    List<Playlist> updatedPlaylists = Mocks.sequences();
    updatedPlaylists.get(0).setSequenceGroup("Group");
    updatedPlaylists.get(0).setSequenceVotes(22222);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(remoteToken), eq(true))).thenReturn(playlists).thenReturn(updatedPlaylists);
    when(this.playlistGroupRepository.findAllByRemoteTokenOrderBySequenceGroupVotesDesc(eq(remoteToken))).thenReturn(playlistGroups);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<HighestVotedPlaylistResponse> response = this.pluginService.highestVotedPlaylist();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(0, playlists.get(0).getSequenceVisibleCount().intValue());
    //assertEquals(3, playlistGroups.get(0).getSequenceGroupVisibleCount().intValue());

    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(remoteToken);
    verify(viewerVoteWinStatsRepository, times(1)).save(any(ViewerVoteWinStats.class));
    verify(playlistRepository, times(2)).saveAll(anyList());
    verify(playlistRepository, times(1)).save(any(Playlist.class));
    verify(playlistGroupRepository, times(2)).save(playlistGroups.get(0));
  }

  @Test
  public void highestVotedPlaylist_updateHideSequence() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(0).setSequenceVotes(3);
    playlists.get(1).setSequenceVisibleCount(3);
    RemotePreference remotePreference = Mocks.remotePreference();
    remotePreference.setHideSequenceCount(3);

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(remoteToken), eq(true))).thenReturn(playlists);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<HighestVotedPlaylistResponse> response = this.pluginService.highestVotedPlaylist();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(5, playlists.get(0).getSequenceVisibleCount().intValue());
    assertEquals(3, playlists.get(1).getSequenceVisibleCount().intValue());

    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(remoteToken);
    verify(viewerVoteWinStatsRepository, times(1)).save(any(ViewerVoteWinStats.class));
    verify(playlistRepository, times(2)).saveAll(anyList());
    verify(playlistRepository, times(2)).save(any(Playlist.class));
  }

  @Test
  public void highestVotedPlaylist_noVotes() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(remoteToken), eq(true))).thenReturn(playlists);

    ResponseEntity<HighestVotedPlaylistResponse> response = this.pluginService.highestVotedPlaylist();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());

    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(remoteToken);
    verify(viewerVoteWinStatsRepository, times(0)).save(any(ViewerVoteWinStats.class));
    verify(playlistRepository, times(1)).saveAll(anyList());
    verify(playlistRepository, times(0)).save(any(Playlist.class));
  }

  @Test
  public void highestVotedPlaylist_noVotes_updateHideSequence() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    playlists.get(1).setSequenceVisibleCount(3);
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(eq(remoteToken), eq(true))).thenReturn(playlists);

    ResponseEntity<HighestVotedPlaylistResponse> response = this.pluginService.highestVotedPlaylist();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(3, playlists.get(1).getSequenceVisibleCount().intValue());

    verify(remoteViewerVoteRepository, times(1)).deleteAllByRemoteToken(remoteToken);
    verify(viewerVoteWinStatsRepository, times(0)).save(any(ViewerVoteWinStats.class));
    verify(playlistRepository, times(1)).saveAll(anyList());
    verify(playlistRepository, times(0)).save(any(Playlist.class));
  }

  @Test
  public void pluginVersion() {
    String remoteToken = "abc123";
    Remote remote = Mocks.remote();
    PluginVersion pluginVersion = Mocks.pluginVersion();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remoteRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remote);

    ResponseEntity<PluginResponse> response = this.pluginService.pluginVersion(pluginVersion);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Success", response.getBody().getMessage());

    verify(remoteRepository, times(1)).save(remote);
  }

  @Test
  public void remotePreferences() {
    String remoteToken = "abc123";
    Remote remote = Mocks.remote();
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remoteRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remote);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<RemotePreferenceResponse> response = this.pluginService.remotePreferences();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("jukebox", response.getBody().getViewerControlMode());
  }

  @Test
  public void remotePreferences_noRemote() {
    String remoteToken = "abc123";

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remoteRepository.findByRemoteToken(eq(remoteToken))).thenReturn(null);

    ResponseEntity<RemotePreferenceResponse> response = this.pluginService.remotePreferences();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(204), response.getStatusCode());
  }

  @Test
  public void remotePreferences_noRemotePrefs() {
    String remoteToken = "abc123";
    Remote remote = Mocks.remote();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remoteRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remote);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(null);

    ResponseEntity<RemotePreferenceResponse> response = this.pluginService.remotePreferences();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(204), response.getStatusCode());
  }

  @Test
  public void purgeQueue() {
    String remoteToken = "abc123";

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);

    ResponseEntity<PluginResponse> response = this.pluginService.purgeQueue();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Success", response.getBody().getMessage());

    verify(remoteJukeRepository, times(1)).deleteByRemoteToken(remoteToken);
  }

  @Test
  public void resetAllVotes() {
    String remoteToken = "abc123";
    List<Playlist> playlists = Mocks.sequences();
    List<RemoteViewerVote> remoteViewerVotes = Mocks.remoteViewerVotes();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceOrderAsc(eq(remoteToken), eq(true))).thenReturn(playlists);
    when(this.remoteViewerVoteRepository.findAllByRemoteToken(eq(remoteToken))).thenReturn(remoteViewerVotes);

    ResponseEntity<PluginResponse> response = this.pluginService.resetAllVotes();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Success", response.getBody().getMessage());

    verify(playlistRepository, times(1)).saveAll(anyList());
    verify(remoteViewerVoteRepository, times(1)).deleteAll(anyList());
  }

  @Test
  public void toggleViewerControl() {
    String remoteToken = "abc123";
    RemotePreference remotePreference = Mocks.remotePreference();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<PluginResponse> response = this.pluginService.toggleViewerControl();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertFalse(response.getBody().getViewerControlEnabled());

    verify(remotePreferenceRepository, times(1)).save(remotePreference);
  }

  @Test
  public void updateViewerControl() {
    String remoteToken = "abc123";
    RemotePreference remotePreference = Mocks.remotePreference();
    ViewerControlRequest viewerControlRequest = Mocks.viewerControlRequest();

    when(this.authUtil.getRemoteTokenFromHeader()).thenReturn(remoteToken);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(remoteToken))).thenReturn(remotePreference);

    ResponseEntity<PluginResponse> response = this.pluginService.updateViewerControl(viewerControlRequest);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertTrue(response.getBody().getViewerControlEnabled());

    verify(remotePreferenceRepository, times(1)).save(remotePreference);
  }

}
