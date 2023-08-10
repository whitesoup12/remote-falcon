package com.remotefalcon.api.service;

import com.remotefalcon.api.Mocks;
import com.remotefalcon.api.dto.TokenDTO;
import com.remotefalcon.api.entity.*;
import com.remotefalcon.api.repository.*;
import com.remotefalcon.api.request.DashboardRequest;
import com.remotefalcon.api.service.DashboardService;
import com.remotefalcon.api.util.AuthUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.ZonedDateTime;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class DashboardServiceTest {

  @InjectMocks
  DashboardService dashboardService;

  @Mock private ViewerPageStatsRepository viewerPageStatsRepository;
  @Mock private ViewerJukeStatsRepository viewerJukeStatsRepository;
  @Mock private ViewerVoteStatsRepository viewerVoteStatsRepository;
  @Mock private ViewerVoteWinStatsRepository viewerVoteWinStatsRepository;
  @Mock private ActiveViewerRepository activeViewerRepository;
  @Mock private AuthUtil jwtUtil;

  @Test
  public void combineAllTheCommentedOutOnes() {
    assertTrue(true);
  }

//  @Test
//  public void viewerPageVisitsByDate() {
//    DashboardRequest request = Mocks.dashboardRequest();
//    TokenDTO tokenDTO = Mocks.tokenDTO();
//    List<ViewerPageStats> viewerPageStats = Mocks.viewerPageStatsList();
//
//    when(this.viewerPageStatsRepository.findAllByRemoteTokenAndPageVisitDateTimeBetween(eq(tokenDTO.getRemoteToken()), any(ZonedDateTime.class), any(ZonedDateTime.class))).thenReturn(viewerPageStats);
//
//    List<ViewerPageStats> response = this.dashboardService.viewerPageVisitsByDate(request, tokenDTO.getRemoteToken());
//    assertNotNull(response);
//    assertNotNull(response);
//    assertFalse(response.isEmpty());
//    assertEquals(2, response.size());
//    assertEquals(2, response.get(0).getUniqueVisits().intValue());
//  }
//
//  @Test
//  public void jukeboxRequestsByDate() {
//    DashboardRequest request = Mocks.dashboardRequest();
//    TokenDTO tokenDTO = Mocks.tokenDTO();
//    List<ViewerJukeStats> viewerJukeStats = Mocks.viewerJukeStats();
//
//    when(this.viewerJukeStatsRepository.findAllByRemoteTokenAndRequestDateTimeBetween(eq(tokenDTO.getRemoteToken()), any(ZonedDateTime.class), any(ZonedDateTime.class))).thenReturn(viewerJukeStats);
//
//    List<ViewerJukeStats> response = this.dashboardService.jukeboxRequestsByDate(request, tokenDTO.getRemoteToken());
//    assertNotNull(response);
//    assertNotNull(response);
//    assertFalse(response.isEmpty());
//    assertEquals(2, response.size());
//    assertEquals(2, response.get(0).getTotalRequests().intValue());
//  }
//
//  @Test
//  public void jukeboxRequestsBySequence() {
//    DashboardRequest request = Mocks.dashboardRequest();
//    TokenDTO tokenDTO = Mocks.tokenDTO();
//    List<ViewerJukeStats> viewerJukeStats = Mocks.viewerJukeStats();
//
//    when(this.viewerJukeStatsRepository.findAllByRemoteTokenAndRequestDateTimeBetween(eq(tokenDTO.getRemoteToken()), any(ZonedDateTime.class), any(ZonedDateTime.class))).thenReturn(viewerJukeStats);
//
//    ViewerJukeStats response = this.dashboardService.jukeboxRequestsBySequence(request, tokenDTO.getRemoteToken());
//    assertNotNull(response);
//    assertNotNull(response);
//    assertEquals(2, response.getSequenceRequests().size());
//    assertEquals(2, response.getSequenceRequests().get(0).getSequenceRequests().intValue());
//  }
//
//  @Test
//  public void viewerVoteStatsByDate() {
//    DashboardRequest request = Mocks.dashboardRequest();
//    TokenDTO tokenDTO = Mocks.tokenDTO();
//    List<ViewerVoteStats> viewerVoteStats = Mocks.viewerVoteStats();
//
//    when(this.jwtUtil.getJwtPayload()).thenReturn(tokenDTO);
//    when(this.viewerVoteStatsRepository.findAllByRemoteTokenAndVoteDateTimeBetween(eq(tokenDTO.getRemoteToken()), any(ZonedDateTime.class), any(ZonedDateTime.class))).thenReturn(viewerVoteStats);
//
//    List<ViewerVoteStats> response = this.dashboardService.viewerVoteStatsByDate(request, tokenDTO.getRemoteToken());
//    assertNotNull(response);
//    assertNotNull(response);
//    assertEquals(2, response.size());
//    assertEquals(2, response.get(0).getTotalVotes().intValue());
//  }
//
//  @Test
//  public void viewerVoteStatsByPlaylist() {
//    DashboardRequest request = Mocks.dashboardRequest();
//    TokenDTO tokenDTO = Mocks.tokenDTO();
//    List<ViewerVoteStats> viewerVoteStats = Mocks.viewerVoteStats();
//
//    when(this.jwtUtil.getJwtPayload()).thenReturn(tokenDTO);
//    when(this.viewerVoteStatsRepository.findAllByRemoteTokenAndVoteDateTimeBetween(eq(tokenDTO.getRemoteToken()), any(ZonedDateTime.class), any(ZonedDateTime.class))).thenReturn(viewerVoteStats);
//
//    ResponseEntity<ViewerVoteStats> response = this.dashboardService.viewerVoteStatsByPlaylist(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//    assertNotNull(response.getBody());
//    assertEquals(2, response.getBody().getSequenceVotes().size());
//    assertEquals(2, response.getBody().getSequenceVotes().get(0).getSequenceVotes().intValue());
//  }
//
//  @Test
//  public void viewerVoteWinStatsByDate() {
//    DashboardRequest request = Mocks.dashboardRequest();
//    TokenDTO tokenDTO = Mocks.tokenDTO();
//    List<ViewerVoteWinStats> viewerVoteWinStats = Mocks.viewerVoteWinStats();
//
//    when(this.jwtUtil.getJwtPayload()).thenReturn(tokenDTO);
//    when(this.viewerVoteWinStatsRepository.findAllByRemoteTokenAndVoteWinDateTimeBetween(eq(tokenDTO.getRemoteToken()), any(ZonedDateTime.class), any(ZonedDateTime.class))).thenReturn(viewerVoteWinStats);
//
//    ResponseEntity<List<ViewerVoteWinStats>> response = this.dashboardService.viewerVoteWinStatsByDate(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//    assertNotNull(response.getBody());
//    assertEquals(2, response.getBody().size());
//    assertEquals(2, response.getBody().get(0).getTotalVotes().intValue());
//  }
//
//  @Test
//  public void viewerVoteWinStatsByPlaylist() {
//    DashboardRequest request = Mocks.dashboardRequest();
//    TokenDTO tokenDTO = Mocks.tokenDTO();
//    List<ViewerVoteWinStats> viewerVoteWinStats = Mocks.viewerVoteWinStats();
//
//    when(this.jwtUtil.getJwtPayload()).thenReturn(tokenDTO);
//    when(this.viewerVoteWinStatsRepository.findAllByRemoteTokenAndVoteWinDateTimeBetween(eq(tokenDTO.getRemoteToken()), any(ZonedDateTime.class), any(ZonedDateTime.class))).thenReturn(viewerVoteWinStats);
//
//    ResponseEntity<ViewerVoteWinStats> response = this.dashboardService.viewerVoteWinStatsByPlaylist(request);
//    assertNotNull(response);
//    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
//    assertNotNull(response.getBody());
//    assertEquals(2, response.getBody().getSequenceWins().size());
//    assertEquals(2, response.getBody().getSequenceWins().get(0).getSequenceWins().intValue());
//  }

  @Test
  public void activeViewers() {
    TokenDTO tokenDTO = Mocks.tokenDTO();
    List<ActiveViewer> activeViewers = Mocks.activeViewers();

    when(this.jwtUtil.getJwtPayload()).thenReturn(tokenDTO);
    when(this.activeViewerRepository.findAllByRemoteToken(eq(tokenDTO.getRemoteToken()))).thenReturn(activeViewers);

    ResponseEntity<Integer> response = this.dashboardService.activeViewers();
    assertNotNull(response);
    assertEquals(HttpStatus.valueOf(200), response.getStatusCode());
    assertNotNull(response.getBody());
    assertEquals(1, response.getBody().intValue());

    verify(activeViewerRepository, times(1)).deleteAll(anyList());
  }
}
