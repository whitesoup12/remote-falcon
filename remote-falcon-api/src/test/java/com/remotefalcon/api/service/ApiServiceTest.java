package com.remotefalcon.api.service;

import com.remotefalcon.api.Mocks;
import com.remotefalcon.api.entity.ExternalApiAccess;
import com.remotefalcon.api.entity.Playlist;
import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.entity.RemotePreference;
import com.remotefalcon.api.repository.CurrentPlaylistRepository;
import com.remotefalcon.api.repository.FppScheduleRepository;
import com.remotefalcon.api.repository.PlaylistRepository;
import com.remotefalcon.api.repository.RemoteJukeRepository;
import com.remotefalcon.api.repository.RemotePreferenceRepository;
import com.remotefalcon.api.repository.RemoteRepository;
import com.remotefalcon.api.repository.RemoteViewerVoteRepository;
import com.remotefalcon.api.repository.ViewerJukeStatsRepository;
import com.remotefalcon.api.repository.ViewerVoteStatsRepository;
import com.remotefalcon.api.response.RemoteResponse;
import com.remotefalcon.api.response.api.PreferencesResponse;
import com.remotefalcon.api.response.api.SequencesResponse;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.ClientUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ApiServiceTest {
  @InjectMocks ApiService apiService;

  @Mock private RemoteRepository remoteRepository;
  @Mock private RemotePreferenceRepository remotePreferenceRepository;
  @Mock private PlaylistRepository playlistRepository;
  @Mock private CurrentPlaylistRepository currentPlaylistRepository;
  @Mock private RemoteJukeRepository remoteJukeRepository;
  @Mock private FppScheduleRepository fppScheduleRepository;
  @Mock private ViewerJukeStatsRepository viewerJukeStatsRepository;
  @Mock private RemoteViewerVoteRepository remoteViewerVoteRepository;
  @Mock private ViewerVoteStatsRepository viewerVoteStatsRepository;
  @Mock private ClientUtil clientUtil;
  @Mock private AuthUtil authUtil;

  @Test
  public void preferences() {
    String subdomain = "awesomeshow";
    ExternalApiAccess externalApiAccess = Mocks.externalApiAccess();
    Remote remote = Mocks.remote();
    RemotePreference remotePreference = Mocks.remotePreference();
    PreferencesResponse preferencesResponse = Mocks.preferencesResponse();

    when(this.authUtil.getApiAccessFromApiJwt()).thenReturn(externalApiAccess);
    when(this.remoteRepository.findByRemoteToken(eq(externalApiAccess.getRemoteToken()))).thenReturn(remote);
    when(this.remotePreferenceRepository.findByRemoteToken(eq(externalApiAccess.getRemoteToken()))).thenReturn(remotePreference);

    ResponseEntity<PreferencesResponse> response = this.apiService.preferences(subdomain);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals("Awesome Show", response.getBody().getShowName());
  }

  @Test
  public void sequences() {
    String subdomain = "awesomeshow";
    ExternalApiAccess externalApiAccess = Mocks.externalApiAccess();
    List<Playlist> playlists = Mocks.sequences();

    when(this.authUtil.getApiAccessFromApiJwt()).thenReturn(externalApiAccess);
    when(this.playlistRepository.findAllByRemoteTokenAndIsSequenceActive(eq(externalApiAccess.getRemoteToken()), eq(true))).thenReturn(playlists);

    ResponseEntity<List<SequencesResponse>> response = this.apiService.sequences(subdomain);
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(3, response.getBody().size());
  }
}
