package com.remotefalcon.api.service;

import com.google.common.collect.Lists;
import com.remotefalcon.api.entity.CurrentPlaylist;
import com.remotefalcon.api.entity.ExternalApiAccess;
import com.remotefalcon.api.entity.FppSchedule;
import com.remotefalcon.api.entity.Playlist;
import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.entity.RemoteJuke;
import com.remotefalcon.api.entity.RemotePreference;
import com.remotefalcon.api.entity.RemoteViewerVote;
import com.remotefalcon.api.entity.ViewerJukeStats;
import com.remotefalcon.api.entity.ViewerVoteStats;
import com.remotefalcon.api.repository.CurrentPlaylistRepository;
import com.remotefalcon.api.repository.FppScheduleRepository;
import com.remotefalcon.api.repository.PlaylistRepository;
import com.remotefalcon.api.repository.RemoteJukeRepository;
import com.remotefalcon.api.repository.RemotePreferenceRepository;
import com.remotefalcon.api.repository.RemoteRepository;
import com.remotefalcon.api.repository.RemoteViewerVoteRepository;
import com.remotefalcon.api.repository.ViewerJukeStatsRepository;
import com.remotefalcon.api.repository.ViewerVoteStatsRepository;
import com.remotefalcon.api.request.api.AddSequenceApiRequest;
import com.remotefalcon.api.response.AddSequenceResponse;
import com.remotefalcon.api.response.api.CurrentlyPlayingResponse;
import com.remotefalcon.api.response.api.PreferencesResponse;
import com.remotefalcon.api.response.api.QueueDepthResponse;
import com.remotefalcon.api.response.api.SequencesResponse;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.ClientUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApiService {
  private final RemoteRepository remoteRepository;
  private final RemotePreferenceRepository remotePreferenceRepository;
  private final PlaylistRepository playlistRepository;
  private final CurrentPlaylistRepository currentPlaylistRepository;
  private final RemoteJukeRepository remoteJukeRepository;
  private final FppScheduleRepository fppScheduleRepository;
  private final ViewerJukeStatsRepository viewerJukeStatsRepository;
  private final RemoteViewerVoteRepository remoteViewerVoteRepository;
  private final ViewerVoteStatsRepository viewerVoteStatsRepository;
  private final ClientUtil clientUtil;
  private final AuthUtil authUtil;

  @Autowired
  public ApiService(RemoteRepository remoteRepository, RemotePreferenceRepository remotePreferenceRepository,
                    PlaylistRepository playlistRepository, CurrentPlaylistRepository currentPlaylistRepository,
                    RemoteJukeRepository remoteJukeRepository, FppScheduleRepository fppScheduleRepository,
                    ViewerJukeStatsRepository viewerJukeStatsRepository, RemoteViewerVoteRepository remoteViewerVoteRepository,
                    ViewerVoteStatsRepository viewerVoteStatsRepository, ClientUtil clientUtil, AuthUtil authUtil) {
    this.remoteRepository = remoteRepository;
    this.remotePreferenceRepository = remotePreferenceRepository;
    this.playlistRepository = playlistRepository;
    this.currentPlaylistRepository = currentPlaylistRepository;
    this.remoteJukeRepository = remoteJukeRepository;
    this.fppScheduleRepository = fppScheduleRepository;
    this.viewerJukeStatsRepository = viewerJukeStatsRepository;
    this.remoteViewerVoteRepository = remoteViewerVoteRepository;
    this.viewerVoteStatsRepository = viewerVoteStatsRepository;
    this.clientUtil = clientUtil;
    this.authUtil = authUtil;
  }

  public ResponseEntity<PreferencesResponse> preferences(String subdomain) {
    ExternalApiAccess externalApiAccess = this.authUtil.getApiAccessFromApiJwt();
    Remote remote = this.remoteRepository.findByRemoteToken(externalApiAccess.getRemoteToken());
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(externalApiAccess.getRemoteToken());
    PreferencesResponse preferencesResponse = PreferencesResponse.builder()
            .enableGeolocation(remotePreference.getEnableGeolocation())
            .enableLocationCode(remotePreference.getEnableLocationCode())
            .jukeboxDepth(remotePreference.getJukeboxDepth())
            .locationCode(remotePreference.getLocationCode())
            .messageDisplayTime(remotePreference.getMessageDisplayTime())
            .showName(remote.getRemoteName())
            .viewerControlEnabled(remotePreference.getViewerControlEnabled())
            .viewerControlMode(remotePreference.getViewerControlMode())
            .build();
    return ResponseEntity.status(200).body(preferencesResponse);
  }

  public ResponseEntity<List<SequencesResponse>> sequences(String subdomain) {
    ExternalApiAccess externalApiAccess = this.authUtil.getApiAccessFromApiJwt();
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenAndIsSequenceActive(externalApiAccess.getRemoteToken(), true);
    List<SequencesResponse> sequencesResponseList = new ArrayList<>();
    playlists.forEach(playlist -> {
      sequencesResponseList.add(SequencesResponse.builder()
              .sequenceName(playlist.getSequenceName())
              .sequenceDisplayName(playlist.getSequenceDisplayName())
              .sequenceDuration(playlist.getSequenceDuration())
              .sequenceImageUrl(playlist.getSequenceImageUrl())
              .sequenceVisible(playlist.getSequenceVisible())
              .build());
    });
    return ResponseEntity.status(200).body(sequencesResponseList);
  }

  public ResponseEntity<CurrentlyPlayingResponse> currentlyPlaying(String subdomain) {
    ExternalApiAccess externalApiAccess = this.authUtil.getApiAccessFromApiJwt();
    Optional<CurrentPlaylist> currentPlaylist = this.currentPlaylistRepository.findByRemoteToken(externalApiAccess.getRemoteToken());
    CurrentlyPlayingResponse currentlyPlayingResponse = null;
    if(currentPlaylist.isPresent()) {
      currentlyPlayingResponse = CurrentlyPlayingResponse.builder()
              .currentSequence(currentPlaylist.get().getCurrentPlaylist())
              .build();
    }
    return currentlyPlayingResponse == null ? ResponseEntity.status(204).build() : ResponseEntity.status(200).body(currentlyPlayingResponse);
  }

  public ResponseEntity<CurrentlyPlayingResponse> nextSequenceInQueue(String subdomain) {
    ExternalApiAccess externalApiAccess = this.authUtil.getApiAccessFromApiJwt();
    List<RemoteJuke> remoteJukes = this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(externalApiAccess.getRemoteToken());
    Optional<RemoteJuke> nextRemoteJuke = remoteJukes.stream().findFirst();
    String nextSequence;
    if(nextRemoteJuke.isPresent()) {
      nextSequence = nextRemoteJuke.get().getNextPlaylist();
    }else {
      Optional<FppSchedule> nextScheduledSequence = this.fppScheduleRepository.findByRemoteToken(externalApiAccess.getRemoteToken());
      nextSequence = nextScheduledSequence.map(FppSchedule::getNextScheduledSequence).orElse(null);
    }
    CurrentlyPlayingResponse currentlyPlayingResponse = CurrentlyPlayingResponse.builder()
            .currentSequence(nextSequence)
            .build();
    return ResponseEntity.status(200).body(currentlyPlayingResponse);
  }

  public ResponseEntity<List<String>> allSequencesInQueue(String subdomain) {
    ExternalApiAccess externalApiAccess = this.authUtil.getApiAccessFromApiJwt();
    List<RemoteJuke> remoteJukes = this.getAllJukeboxRequests(externalApiAccess.getRemoteToken());
    List<String> sequences = remoteJukes.stream().filter(remoteJuke -> StringUtils.isNotEmpty(remoteJuke.getFuturePlaylist())).map(RemoteJuke::getSequence).collect(Collectors.toList());
    return ResponseEntity.status(200).body(sequences);
  }

  public ResponseEntity<QueueDepthResponse> currentQueueDepth(String subdomain) {
    ExternalApiAccess externalApiAccess = this.authUtil.getApiAccessFromApiJwt();
    List<RemoteJuke> remoteJukes = this.remoteJukeRepository.findAllByRemoteToken(externalApiAccess.getRemoteToken());
    return ResponseEntity.status(200).body(QueueDepthResponse.builder().queueDepth(remoteJukes.size()).build());
  }

  public ResponseEntity<?> addSequenceToQueue(String subdomain, AddSequenceApiRequest request) {
    ExternalApiAccess externalApiAccess = this.authUtil.getApiAccessFromApiJwt();
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(externalApiAccess.getRemoteToken());
    int jukeboxDepth = remotePreference.getJukeboxDepth();
    List<RemoteJuke> remoteJukes = this.getAllJukeboxRequests(externalApiAccess.getRemoteToken());
    List<String> sequences = remoteJukes.stream().map(RemoteJuke::getSequence).collect(Collectors.toList());
    if(jukeboxDepth != 0 && sequences.size() >= jukeboxDepth) {
      return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("QUEUE_FULL").build());
    }
    if(remotePreference.getEnableGeolocation()) {
      double distance = this.distance(remotePreference.getRemoteLatitude(), remotePreference.getRemoteLongitude(), request.getViewerLatitude(), request.getViewerLongitude());
      if(distance > remotePreference.getAllowedRadius()) {
        return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("INVALID_LOCATION").build());
      }
    }
    List<String> sequencesByMostRecent = Lists.reverse(sequences);
    List<String> sequencesRecentlyRequested = sequencesByMostRecent.stream().limit(remotePreference.getJukeboxRequestLimit()).collect(Collectors.toList());
    if(sequencesRecentlyRequested.contains(request.getSequence())) {
      return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("SONG_REQUESTED").build());
    }
    Optional<CurrentPlaylist> currentPlaylist = this.currentPlaylistRepository.findByRemoteToken(externalApiAccess.getRemoteToken());
    if(currentPlaylist.isPresent() && StringUtils.equalsIgnoreCase(currentPlaylist.get().getCurrentPlaylist(), request.getSequence())) {
      return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("SONG_REQUESTED").build());
    }
    RemoteJuke sequenceToAdd = RemoteJuke.builder()
            .ownerRequested(false)
            .remoteToken(externalApiAccess.getRemoteToken())
            .build();
    List<RemoteJuke> remoteJukesByMostRecent = Lists.reverse(remoteJukes);
    Optional<RemoteJuke> mostCurrentRequest = remoteJukesByMostRecent.stream().findFirst();
    int nextRequestSequence = 1;
    if(mostCurrentRequest.isPresent()) {
      nextRequestSequence = mostCurrentRequest.get().getFuturePlaylistSequence() + 1;
      sequenceToAdd.setFuturePlaylist(request.getSequence());
    }else {
      sequenceToAdd.setNextPlaylist(request.getSequence());
    }
    sequenceToAdd.setFuturePlaylistSequence(nextRequestSequence);
    this.remoteJukeRepository.save(sequenceToAdd);
    this.saveViewerJukeStats(externalApiAccess.getRemoteToken(), request.getSequence());
    if(remotePreference.getPsaEnabled() != null && remotePreference.getPsaEnabled()) {
      this.addPSAToQueue(externalApiAccess.getRemoteToken(), remotePreference.getPsaFrequency(), nextRequestSequence, remotePreference.getPsaSequence());
    }
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> voteForSequence(String subdomain, AddSequenceApiRequest request, HttpServletRequest httpServletRequest) {
    ExternalApiAccess externalApiAccess = this.authUtil.getApiAccessFromApiJwt();
    String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(externalApiAccess.getRemoteToken());
    boolean checkIfVoted = remotePreference.getCheckIfVoted() != null && remotePreference.getCheckIfVoted();
    List<Playlist> allPlaylists = this.playlistRepository.findAllByRemoteToken(externalApiAccess.getRemoteToken());
    List<String> sequences = allPlaylists.stream().map(Playlist::getSequenceName).collect(Collectors.toList());
    if(remotePreference.getEnableGeolocation()) {
      double distance = this.distance(remotePreference.getRemoteLatitude(), remotePreference.getRemoteLongitude(), request.getViewerLatitude(), request.getViewerLongitude());
      if(distance > remotePreference.getAllowedRadius()) {
        return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("INVALID_LOCATION").build());
      }
    }
    if(checkIfVoted) {
      Optional<RemoteViewerVote> remoteViewerVote = this.remoteViewerVoteRepository.findByRemoteTokenAndViewerIp(externalApiAccess.getRemoteToken(), ipAddress);
      if(remoteViewerVote.isPresent()) {
        return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("ALREADY_VOTED").build());
      }
    }
    Optional<Playlist> votedPlaylist = allPlaylists.stream().filter(playlist -> StringUtils.equalsIgnoreCase(playlist.getSequenceName(), request.getSequence())).findFirst();
    if(votedPlaylist.isPresent()) {
      int playlistVotes = votedPlaylist.get().getSequenceVotes() + 1;
      votedPlaylist.get().setSequenceVotes(playlistVotes);
      votedPlaylist.get().setSequenceVoteTime(ZonedDateTime.now());
      this.playlistRepository.save(votedPlaylist.get());
      if(checkIfVoted) {
        RemoteViewerVote remoteViewerVote = RemoteViewerVote.builder()
                .remoteToken(externalApiAccess.getRemoteToken())
                .viewerIp(ipAddress)
                .build();
        this.remoteViewerVoteRepository.save(remoteViewerVote);
      }
      this.saveViewerVoteStats(externalApiAccess.getRemoteToken(), request.getSequence());
    }else {
      return ResponseEntity.status(400).build();
    }
    return ResponseEntity.status(200).build();
  }

  private List<RemoteJuke> getAllJukeboxRequests(String remoteToken) {
    List<RemoteJuke> remoteJukes = this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(remoteToken);
    List<RemoteJuke> allJukeRequests = new ArrayList<>();
    remoteJukes.forEach(juke -> {
      if(!StringUtils.isEmpty(juke.getNextPlaylist())) {
        Optional<Playlist> playlist = this.playlistRepository.findFirstByRemoteTokenAndSequenceName(remoteToken, juke.getNextPlaylist());
        playlist.ifPresent(value -> juke.setSequence(value.getSequenceDisplayName()));
        allJukeRequests.add(juke);
      }
      if(!StringUtils.isEmpty(juke.getFuturePlaylist())) {
        Optional<Playlist> playlist = this.playlistRepository.findFirstByRemoteTokenAndSequenceName(remoteToken, juke.getFuturePlaylist());
        playlist.ifPresent(value -> juke.setSequence(value.getSequenceDisplayName()));
        allJukeRequests.add(juke);
      }
    });
    return allJukeRequests;
  }

  private void addPSAToQueue(String remoteToken, Integer psaFrequency, Integer nextRequestSequence, String psaSequence) {
    ZonedDateTime todayOhHundred = ZonedDateTime.now().withHour(0).withMinute(0).withSecond(0);
    int jukeStatsCount = this.viewerJukeStatsRepository.countAllByRemoteTokenAndRequestDateTimeAfter(remoteToken, todayOhHundred);
    if(jukeStatsCount % psaFrequency == 0) {
      nextRequestSequence += 1;
      RemoteJuke psaToAdd = RemoteJuke.builder()
              .ownerRequested(false)
              .remoteToken(remoteToken)
              .futurePlaylistSequence(nextRequestSequence)
              .futurePlaylist(psaSequence)
              .build();
      this.remoteJukeRepository.save(psaToAdd);
    }
  }

  private void saveViewerJukeStats(String remoteToken, String playlist) {
    ViewerJukeStats viewerJukeStats = ViewerJukeStats.builder()
            .remoteToken(remoteToken)
            .playlistName(playlist)
            .requestDateTime(ZonedDateTime.now())
            .build();
    this.viewerJukeStatsRepository.save(viewerJukeStats);
  }

  private void saveViewerVoteStats(String remoteToken, String playlist) {
    ViewerVoteStats viewerVoteStats = ViewerVoteStats.builder()
            .remoteToken(remoteToken)
            .playlistName(playlist)
            .voteDateTime(ZonedDateTime.now())
            .build();
    this.viewerVoteStatsRepository.save(viewerVoteStats);
  }

  private Double distance(double lat1, double lon1, double lat2, double lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0.0;
    }else {
      double theta = lon1 - lon2;
      double dist = Math.sin(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)) + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.cos(Math.toRadians(theta));
      dist = Math.acos(dist);
      dist = Math.toDegrees(dist);
      return dist * 60 * 1.1515;
    }
  }
}
