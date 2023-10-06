package com.remotefalcon.api.service;

import com.google.common.collect.Lists;
import com.remotefalcon.api.dto.ViewerTokenDTO;
import com.remotefalcon.api.entity.*;
import com.remotefalcon.api.repository.*;
import com.remotefalcon.api.request.AddSequenceRequest;
import com.remotefalcon.api.request.ViewerPageVisitRequest;
import com.remotefalcon.api.response.AddSequenceResponse;
import com.remotefalcon.api.response.ExternalViewerPageDetailsResponse;
import com.remotefalcon.api.response.ViewerRemotePreferencesResponse;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.ClientUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ViewerPageService {
  private final PlaylistRepository playlistRepository;
  private final RemoteRepository remoteRepository;
  private final RemotePreferenceRepository remotePreferenceRepository;
  private final ActiveViewerRepository activeViewerRepository;
  private final CurrentPlaylistRepository currentPlaylistRepository;
  private final ViewerPageStatsRepository viewerPageStatsRepository;
  private final ViewerPageMetaRepository viewerPageMetaRepository;
  private final RemoteJukeRepository remoteJukeRepository;
  private final ViewerVoteStatsRepository viewerVoteStatsRepository;
  private final ViewerJukeStatsRepository viewerJukeStatsRepository;
  private final RemoteViewerVoteRepository remoteViewerVoteRepository;
  private final FppScheduleRepository fppScheduleRepository;
  private final AuthUtil authUtil;
  private final ClientUtil clientUtil;
  private final PlaylistGroupRepository playlistGroupRepository;
  private final PsaSequenceRepository psaSequenceRepository;
  private final RemoteViewerPagesRepository remoteViewerPagesRepository;
  private final DefaultViewerPageRepository defaultViewerPageRepository;

  @Autowired
  public ViewerPageService(PlaylistRepository playlistRepository, RemoteRepository remoteRepository, RemotePreferenceRepository remotePreferenceRepository,
                           ActiveViewerRepository activeViewerRepository, CurrentPlaylistRepository currentPlaylistRepository,  ViewerPageStatsRepository viewerPageStatsRepository,
                           ViewerPageMetaRepository viewerPageMetaRepository, RemoteJukeRepository remoteJukeRepository, ViewerVoteStatsRepository viewerVoteStatsRepository,
                           ViewerJukeStatsRepository viewerJukeStatsRepository, RemoteViewerVoteRepository remoteViewerVoteRepository,
                           FppScheduleRepository fppScheduleRepository, AuthUtil authUtil, ClientUtil clientUtil,
                           PlaylistGroupRepository playlistGroupRepository, PsaSequenceRepository psaSequenceRepository, RemoteViewerPagesRepository remoteViewerPagesRepository,
                           DefaultViewerPageRepository defaultViewerPageRepository) {
    this.playlistRepository = playlistRepository;
    this.remoteRepository = remoteRepository;
    this.remotePreferenceRepository = remotePreferenceRepository;
    this.activeViewerRepository = activeViewerRepository;
    this.currentPlaylistRepository = currentPlaylistRepository;
    this.viewerPageStatsRepository = viewerPageStatsRepository;
    this.viewerPageMetaRepository = viewerPageMetaRepository;
    this.remoteJukeRepository = remoteJukeRepository;
    this.viewerVoteStatsRepository = viewerVoteStatsRepository;
    this.viewerJukeStatsRepository = viewerJukeStatsRepository;
    this.remoteViewerVoteRepository = remoteViewerVoteRepository;
    this.fppScheduleRepository = fppScheduleRepository;
    this.authUtil = authUtil;
    this.clientUtil = clientUtil;
    this.playlistGroupRepository = playlistGroupRepository;
    this.psaSequenceRepository = psaSequenceRepository;
    this.remoteViewerPagesRepository = remoteViewerPagesRepository;
    this.defaultViewerPageRepository = defaultViewerPageRepository;
  }

  public ResponseEntity<ExternalViewerPageDetailsResponse> externalViewerPageDetails() {
    ExternalViewerPageDetailsResponse externalViewerPageDetailsResponse = new ExternalViewerPageDetailsResponse();
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }

    //Gather
    CompletableFuture<ViewerRemotePreferencesResponse> viewerRemotePreferencesResponse = CompletableFuture.supplyAsync(() -> this.remotePrefs(viewerTokenDTO));
    CompletableFuture<List<Playlist>> playlists = CompletableFuture.supplyAsync(() -> this.playlists(viewerTokenDTO));
    CompletableFuture<String> whatsPlaying = CompletableFuture.supplyAsync(() -> this.whatsPlaying(viewerTokenDTO));
    CompletableFuture<String> nextSequence = CompletableFuture.supplyAsync(() -> this.nextPlaylistInQueue(viewerTokenDTO));
    CompletableFuture<Integer> currentQueueDepth = CompletableFuture.supplyAsync(() -> this.currentQueueDepth(viewerTokenDTO));
    CompletableFuture<List<String>> jukeboxRequests = CompletableFuture.supplyAsync(() -> this.allJukeboxRequests(viewerTokenDTO));
    CompletableFuture<ViewerPageMeta> viewerPageMeta = CompletableFuture.supplyAsync(() -> this.getExternalViewerPageMeta(viewerTokenDTO));

    //Execute
    try {
      externalViewerPageDetailsResponse.setRemotePreferences(viewerRemotePreferencesResponse.get());
      externalViewerPageDetailsResponse.setSequences(playlists.get());
      externalViewerPageDetailsResponse.setWhatsPlaying(whatsPlaying.get());
      externalViewerPageDetailsResponse.setNextSequence(nextSequence.get());
      externalViewerPageDetailsResponse.setQueueDepth(currentQueueDepth.get());
      externalViewerPageDetailsResponse.setJukeboxRequests(jukeboxRequests.get());
      externalViewerPageDetailsResponse.setViewerPageMeta(viewerPageMeta.get());
    } catch (ExecutionException | InterruptedException e) {
      log.error("Error getting external viewer page details", e);
    }

    return ResponseEntity.ok(externalViewerPageDetailsResponse);
  }

  public ResponseEntity<List<Playlist>> playlists() {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    List<Playlist> playlists = this.playlists(viewerTokenDTO);
    return ResponseEntity.status(200).body(playlists);
  }

  public List<Playlist> playlists(ViewerTokenDTO viewerTokenDTO) {
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceOrderAsc(viewerTokenDTO.getRemoteToken(), true);
    List<PlaylistGroup> playlistGroups = this.playlistGroupRepository.findAllByRemoteToken(viewerTokenDTO.getRemoteToken());
    playlists = playlists.stream().filter(playlist -> playlist.getSequenceVotes() != -1).toList();
    playlistGroups = playlistGroups.stream().filter(playlistGroup -> playlistGroup.getSequenceGroupVotes() != -1).toList();

    List<Playlist> groupedPlaylists = new ArrayList<>();
    for(Playlist playlist : playlists) {
      if(StringUtils.isNotEmpty(playlist.getSequenceGroup())) {
        Optional<PlaylistGroup> playlistGroup = playlistGroups.stream()
                .filter(group -> StringUtils.equalsIgnoreCase(playlist.getSequenceGroup(), group.getSequenceGroupName()))
                .filter(group -> group.getSequenceGroupVotes() != -1).findFirst();
        playlist.setSequenceName(playlist.getSequenceGroup());
        playlist.setSequenceDisplayName(playlist.getSequenceGroup());
        if(playlistGroup.isPresent() && groupedPlaylists.stream().noneMatch(groupedPlaylist -> StringUtils.equalsIgnoreCase(groupedPlaylist.getSequenceGroup(), playlist.getSequenceGroup()))) {
          playlist.setSequenceVisibleCount(playlistGroup.get().getSequenceGroupVisibleCount());
          groupedPlaylists.add(playlist);
        }
      }else {
        groupedPlaylists.add(playlist);
      }
    }
    for(Playlist groupedPlaylist : groupedPlaylists) {
      playlistGroups.forEach(playlistGroup -> {
        if (StringUtils.equalsIgnoreCase(groupedPlaylist.getSequenceGroup(), playlistGroup.getSequenceGroupName())) {
          groupedPlaylist.setSequenceVotes(playlistGroup.getSequenceGroupVotes());
          groupedPlaylist.setSequenceVoteTime(playlistGroup.getSequenceGroupVoteTime());
        }
      });
    }

    if(StringUtils.equalsIgnoreCase("VOTING", remotePreference.getViewerControlMode())) {
      boolean activeVotes = groupedPlaylists.stream().anyMatch(playlist -> playlist.getSequenceVotes() != 0);
      if(activeVotes) {
        List<Playlist> playlistsWithVotes = groupedPlaylists.stream().filter(playlist -> playlist.getSequenceVotes() != 0)
                .sorted(Comparator.comparing(Playlist::getSequenceVotes).reversed()
                        .thenComparing(Playlist::getSequenceVoteTime)).toList();
        List<Playlist> playlistsWithNoVotes = groupedPlaylists.stream().filter(playlist -> playlist.getSequenceVotes() == 0)
                .sorted(Comparator.comparing(Playlist::getSequenceOrder)).toList();
        groupedPlaylists = new ArrayList<>();
        groupedPlaylists.addAll(playlistsWithVotes);
        groupedPlaylists.addAll(playlistsWithNoVotes);
      }
    }
    return groupedPlaylists;
  }

  public ResponseEntity<String> viewerPageContents() {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    String htmlContent = "";
    Optional<RemoteViewerPages> remoteViewerPage = this.remoteViewerPagesRepository.findFirstByRemoteTokenAndViewerPageActive(viewerTokenDTO.getRemoteToken(), true);
    if(remoteViewerPage.isPresent()) {
      htmlContent = remoteViewerPage.map(RemoteViewerPages::getViewerPageHtml).orElse("");
    }else {
      DefaultViewerPage defaultViewerPage = this.defaultViewerPageRepository.findFirstByIsVersionActive(true);
      htmlContent = defaultViewerPage.getHtmlContent();
    }
    return ResponseEntity.ok(htmlContent);
  }

  public ResponseEntity<ViewerRemotePreferencesResponse> remotePrefs() {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    ViewerRemotePreferencesResponse viewerRemotePreferencesResponse = this.remotePrefs(viewerTokenDTO);
    return ResponseEntity.status(200).body(viewerRemotePreferencesResponse);
  }

  private ViewerRemotePreferencesResponse remotePrefs(ViewerTokenDTO viewerTokenDTO) {
    Remote remote = this.remoteRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    return ViewerRemotePreferencesResponse.builder()
            .viewerControlEnabled(remotePreference.getViewerControlEnabled())
            .viewerModeEnabled(remotePreference.getViewerModeEnabled())
            .locationCode(remotePreference.getLocationCode())
            .messageDisplayTime(remotePreference.getMessageDisplayTime())
            .remoteName(remote.getRemoteName())
            .enableGeolocation(remotePreference.getEnableGeolocation())
            .enableLocationCode(remotePreference.getEnableLocationCode())
            .viewerControlMode(remotePreference.getViewerControlMode())
            .jukeboxDepth(remotePreference.getJukeboxDepth())
            .makeItSnow(remotePreference.getMakeItSnow())
            .build();
  }

  @SneakyThrows
  public ResponseEntity<?> updateActiveViewer(HttpServletRequest httpServletRequest) {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
    Remote remote = this.remoteRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    if(StringUtils.equalsIgnoreCase(remote.getLastLoginIp(), ipAddress)) {
      return ResponseEntity.status(200).build();
    }
    ActiveViewer activeViewer = this.activeViewerRepository.findFirstByRemoteTokenAndViewerIp(viewerTokenDTO.getRemoteToken(), ipAddress);
    if(activeViewer == null) {
      activeViewer = ActiveViewer.builder()
              .remoteToken(viewerTokenDTO.getRemoteToken())
              .viewerIp(ipAddress)
              .build();
    }
    activeViewer.setLastUpdateDateTime(ZonedDateTime.now());
    this.activeViewerRepository.save(activeViewer);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<String> whatsPlaying() {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    String whatsPlaying = this.whatsPlaying(viewerTokenDTO);
    return ResponseEntity.ok(whatsPlaying);
  }

  private String whatsPlaying(ViewerTokenDTO viewerTokenDTO) {
    Optional<CurrentPlaylist> currentPlaylist = this.currentPlaylistRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    if(currentPlaylist.isPresent()) {
      Optional<Playlist> playlist = this.playlistRepository.findFirstByRemoteTokenAndSequenceName(viewerTokenDTO.getRemoteToken(), currentPlaylist.get().getCurrentPlaylist());
      return playlist.isPresent() ? playlist.get().getSequenceDisplayName() : currentPlaylist.get().getCurrentPlaylist();
    }
    return "";
  }

  public ResponseEntity<?> insertViewerPageStats(ViewerPageVisitRequest request, HttpServletRequest httpServletRequest) {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
    Remote remote = this.remoteRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    if(StringUtils.equalsIgnoreCase(remote.getLastLoginIp(), ipAddress)) {
      return ResponseEntity.status(204).build();
    }
    ViewerPageStats viewerPageStats = ViewerPageStats.builder()
            .pageVisitDateTime(request.getPageVisitDate())
            .remoteToken(viewerTokenDTO.getRemoteToken())
            .pageVisitIp(ipAddress)
            .build();
    this.viewerPageStatsRepository.save(viewerPageStats);
    return ResponseEntity.status(200).build();
  }

  private ViewerPageMeta getExternalViewerPageMeta(ViewerTokenDTO viewerTokenDTO) {
    return this.viewerPageMetaRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
  }

  public ResponseEntity<ViewerPageMeta> getViewerPageMeta() {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    ViewerPageMeta viewerPageMeta = this.viewerPageMetaRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    return ResponseEntity.status(200).body(viewerPageMeta);
  }

  public ResponseEntity<String> nextPlaylistInQueue() {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    String nextSequence = this.nextPlaylistInQueue(viewerTokenDTO);
    return ResponseEntity.status(200).body(nextSequence);
  }

  private String nextPlaylistInQueue(ViewerTokenDTO viewerTokenDTO) {
    String nextSequence = null;
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    if(StringUtils.equalsIgnoreCase("JUKEBOX", remotePreference.getViewerControlMode())) {
      List<RemoteJuke> remoteJukes = this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(viewerTokenDTO.getRemoteToken());
      Optional<RemoteJuke> nextRemoteJuke = remoteJukes.stream().findFirst();
      if(nextRemoteJuke.isPresent()) {
        nextSequence = nextRemoteJuke.get().getNextPlaylist();
      }
    }else {
      List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(viewerTokenDTO.getRemoteToken(), true);
      Optional<Playlist> highestVotedPlaylist = playlists.size() > 0 && playlists.get(0).getSequenceVotes() != 0 && playlists.get(0).getSequenceVotes() != -1 ? Optional.of(playlists.get(0)) : Optional.empty();
      if(highestVotedPlaylist.isPresent()) {
        nextSequence = highestVotedPlaylist.get().getSequenceName();
      }
    }

    if(nextSequence == null) {
      Optional<FppSchedule> nextScheduledSequence = this.fppScheduleRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
      nextSequence = nextScheduledSequence.map(FppSchedule::getNextScheduledSequence).orElse(null);
    }

    Optional<Playlist> playlist = this.playlistRepository.findFirstByRemoteTokenAndSequenceName(viewerTokenDTO.getRemoteToken(), nextSequence);
    if(playlist.isPresent()) {
      nextSequence = playlist.get().getSequenceDisplayName();
    }
    return nextSequence;
  }

  public ResponseEntity<Integer> currentQueueDepth() {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    Integer currentQueueDepth = this.currentQueueDepth(viewerTokenDTO);
    return ResponseEntity.status(200).body(currentQueueDepth);
  }

  private Integer currentQueueDepth(ViewerTokenDTO viewerTokenDTO) {
    List<RemoteJuke> remoteJukes = this.remoteJukeRepository.findAllByRemoteToken(viewerTokenDTO.getRemoteToken());
    return remoteJukes.size();
  }

  public ResponseEntity<List<String>> allJukeboxRequests() {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    List<String> sequences = this.allJukeboxRequests(viewerTokenDTO);
    return ResponseEntity.status(200).body(sequences);
  }

  private List<String> allJukeboxRequests(ViewerTokenDTO viewerTokenDTO) {
    List<RemoteJuke> remoteJukes = this.getAllJukeboxRequestsWithDisplayName(viewerTokenDTO.getRemoteToken());
    return remoteJukes.stream().filter(remoteJuke -> StringUtils.isNotEmpty(remoteJuke.getFuturePlaylist())).map(RemoteJuke::getSequence).collect(Collectors.toList());
  }

  public ResponseEntity<AddSequenceResponse> addPlaylistToQueue(@RequestBody AddSequenceRequest request) {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    int jukeboxDepth = remotePreference.getJukeboxDepth();
    List<RemoteJuke> remoteJukes = this.getAllJukeboxRequests(viewerTokenDTO.getRemoteToken());
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
    List<String> sequencesRecentlyRequested = sequencesByMostRecent.stream().limit(remotePreference.getJukeboxRequestLimit()).toList();
    if(sequencesRecentlyRequested.contains(request.getPlaylist())) {
      return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("SONG_REQUESTED").build());
    }
    Optional<CurrentPlaylist> currentPlaylist = this.currentPlaylistRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    if(currentPlaylist.isPresent() && StringUtils.equalsIgnoreCase(currentPlaylist.get().getCurrentPlaylist(), request.getPlaylist())) {
      return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("SONG_REQUESTED").build());
    }
    RemoteJuke sequenceToAdd = RemoteJuke.builder()
            .ownerRequested(false)
            .remoteToken(viewerTokenDTO.getRemoteToken())
            .build();
    List<RemoteJuke> remoteJukesByMostRecent = Lists.reverse(remoteJukes);
    Optional<RemoteJuke> mostCurrentRequest = remoteJukesByMostRecent.stream().findFirst();

    int nextRequestSequence = 1;
    //Check if requested sequence is actually a group
    Optional<Playlist> playlist = this.playlistRepository.findFirstByRemoteTokenAndSequenceGroup(viewerTokenDTO.getRemoteToken(), request.getPlaylist());
    if(playlist.isPresent()) {
      //Group request
      List<RemoteJuke> sequencesToAdd = new ArrayList<>();
      List<Playlist> groupedPlaylists = this.playlistRepository.findAllByRemoteTokenAndSequenceGroupOrderBySequenceOrderAsc(viewerTokenDTO.getRemoteToken(), request.getPlaylist());
      if(mostCurrentRequest.isPresent()) {
        nextRequestSequence = mostCurrentRequest.get().getFuturePlaylistSequence() + 1;
      }
      for(Playlist groupedPlaylist : groupedPlaylists) {
        sequenceToAdd = RemoteJuke.builder()
                .ownerRequested(false)
                .remoteToken(viewerTokenDTO.getRemoteToken())
                .build();
        if(nextRequestSequence > 1) {
          sequenceToAdd.setFuturePlaylist(groupedPlaylist.getSequenceName());
        }else {
          sequenceToAdd.setNextPlaylist(groupedPlaylist.getSequenceName());
        }
        sequenceToAdd.setFuturePlaylistSequence(nextRequestSequence);
        sequencesToAdd.add(sequenceToAdd);
        nextRequestSequence++;
      }
      this.remoteJukeRepository.saveAll(sequencesToAdd);
    }else {
      //Single request
      if(mostCurrentRequest.isPresent()) {
        nextRequestSequence = mostCurrentRequest.get().getFuturePlaylistSequence() + 1;
        sequenceToAdd.setFuturePlaylist(request.getPlaylist());
      }else {
        sequenceToAdd.setNextPlaylist(request.getPlaylist());
      }
      sequenceToAdd.setFuturePlaylistSequence(nextRequestSequence);
      this.remoteJukeRepository.save(sequenceToAdd);
    }

    this.saveViewerJukeStats(viewerTokenDTO.getRemoteToken(), request.getPlaylist());
    if(remotePreference.getPsaEnabled() != null && remotePreference.getPsaEnabled()) {
      Optional<PsaSequence> psaSequence = this.psaSequenceRepository.findFirstByRemoteTokenOrderByPsaSequenceLastPlayedAscPsaSequenceOrderAsc(viewerTokenDTO.getRemoteToken());
      if(psaSequence.isPresent()) {
        this.addPSAToQueue(viewerTokenDTO.getRemoteToken(), remotePreference.getPsaFrequency(), nextRequestSequence, psaSequence.get());
      }
    }
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<AddSequenceResponse> voteForPlaylist(@RequestBody AddSequenceRequest request, HttpServletRequest httpServletRequest) {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    boolean checkIfVoted = remotePreference.getCheckIfVoted() != null && remotePreference.getCheckIfVoted();
    boolean viewerVoteSaved = false;
    if(checkIfVoted) {
      Optional<RemoteViewerVote> remoteViewerVote = this.remoteViewerVoteRepository.findByRemoteTokenAndViewerIp(viewerTokenDTO.getRemoteToken(), ipAddress);
      if(remoteViewerVote.isPresent()) {
        return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("ALREADY_VOTED").build());
      }else {
        RemoteViewerVote saveRemoteViewerVote = RemoteViewerVote.builder()
                .remoteToken(viewerTokenDTO.getRemoteToken())
                .viewerIp(ipAddress)
                .build();
        this.remoteViewerVoteRepository.save(saveRemoteViewerVote);
        viewerVoteSaved = true;
      }
    }
    if(remotePreference.getEnableGeolocation()) {
      double distance = this.distance(remotePreference.getRemoteLatitude(), remotePreference.getRemoteLongitude(), request.getViewerLatitude(), request.getViewerLongitude());
      if(distance > remotePreference.getAllowedRadius()) {
        return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("INVALID_LOCATION").build());
      }
      if(!viewerVoteSaved) {
        RemoteViewerVote saveRemoteViewerVote = RemoteViewerVote.builder()
                .remoteToken(viewerTokenDTO.getRemoteToken())
                .viewerIp(ipAddress)
                .build();
        this.remoteViewerVoteRepository.save(saveRemoteViewerVote);
      }
    }
    if(remotePreference.getEnableGeolocation()) {
      double distance = this.distance(remotePreference.getRemoteLatitude(), remotePreference.getRemoteLongitude(), request.getViewerLatitude(), request.getViewerLongitude());
      if(distance > remotePreference.getAllowedRadius()) {
        return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("INVALID_LOCATION").build());
      }
    }
    Optional<Playlist> votedPlaylist = this.playlistRepository.findFirstByRemoteTokenAndSequenceName(viewerTokenDTO.getRemoteToken(), request.getPlaylist());
    Optional<Playlist> votedPlaylistGroup = this.playlistRepository.findFirstByRemoteTokenAndSequenceGroup(viewerTokenDTO.getRemoteToken(), request.getPlaylist());
    if(votedPlaylist.isPresent()) {
      //Single sequence vote
      int playlistVotes = votedPlaylist.get().getSequenceVotes() + 1;
      int playlistVotesTotal = votedPlaylist.get().getSequenceVotesTotal() + 1;
      votedPlaylist.get().setSequenceVotes(playlistVotes);
      votedPlaylist.get().setSequenceVotesTotal(playlistVotesTotal);
      votedPlaylist.get().setSequenceVoteTime(ZonedDateTime.now());
      this.playlistRepository.save(votedPlaylist.get());
    }else if(votedPlaylistGroup.isPresent()) {
      //Grouped sequence vote
      Optional<PlaylistGroup> playlistGroup = this.playlistGroupRepository.findByRemoteTokenAndSequenceGroupName(viewerTokenDTO.getRemoteToken(), votedPlaylistGroup.get().getSequenceGroup());
      if(playlistGroup.isPresent()) {
        int playlistVotes = playlistGroup.get().getSequenceGroupVotes() + 1;
        int playlistVotesTotal = playlistGroup.get().getSequenceGroupVotesTotal() + 1;
        playlistGroup.get().setSequenceGroupVotes(playlistVotes);
        playlistGroup.get().setSequenceGroupVotesTotal(playlistVotesTotal);
        playlistGroup.get().setSequenceGroupVoteTime(ZonedDateTime.now());
        this.playlistGroupRepository.save(playlistGroup.get());
      }else {
        return ResponseEntity.status(400).build();
      }
    }else {
      return ResponseEntity.status(400).build();
    }
    this.saveViewerVoteStats(viewerTokenDTO.getRemoteToken(), request.getPlaylist());
    return ResponseEntity.status(200).build();
  }

  private List<RemoteJuke> getAllJukeboxRequests(String remoteToken) {
    List<RemoteJuke> remoteJukes = this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(remoteToken);
    List<RemoteJuke> allJukeRequests = new ArrayList<>();
    remoteJukes.forEach(juke -> {
      if(!StringUtils.isEmpty(juke.getNextPlaylist())) {
        Optional<Playlist> playlist = this.playlistRepository.findFirstByRemoteTokenAndSequenceName(remoteToken, juke.getNextPlaylist());
        playlist.ifPresent(value -> juke.setSequence(value.getSequenceName()));
        allJukeRequests.add(juke);
      }
      if(!StringUtils.isEmpty(juke.getFuturePlaylist())) {
        Optional<Playlist> playlist = this.playlistRepository.findFirstByRemoteTokenAndSequenceName(remoteToken, juke.getFuturePlaylist());
        playlist.ifPresent(value -> juke.setSequence(value.getSequenceName()));
        allJukeRequests.add(juke);
      }
    });
    return allJukeRequests;
  }

  private List<RemoteJuke> getAllJukeboxRequestsWithDisplayName(String remoteToken) {
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

  private void addPSAToQueue(String remoteToken, Integer psaFrequency, Integer nextRequestSequence, PsaSequence psaSequence) {
    ZonedDateTime todayOhHundred = ZonedDateTime.now().withHour(0).withMinute(0).withSecond(0);
    int jukeStatsCount = this.viewerJukeStatsRepository.countAllByRemoteTokenAndRequestDateTimeAfter(remoteToken, todayOhHundred);
    if(jukeStatsCount % psaFrequency == 0) {
      nextRequestSequence += 1;
      RemoteJuke psaToAdd = RemoteJuke.builder()
              .ownerRequested(false)
              .remoteToken(remoteToken)
              .futurePlaylistSequence(nextRequestSequence)
              .futurePlaylist(psaSequence.getPsaSequenceName())
              .build();
      this.remoteJukeRepository.save(psaToAdd);

      psaSequence.setPsaSequenceLastPlayed(ZonedDateTime.now());
      this.psaSequenceRepository.save(psaSequence);
    }
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
