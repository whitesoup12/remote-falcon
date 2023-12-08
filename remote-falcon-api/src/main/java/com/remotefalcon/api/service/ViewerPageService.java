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

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

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

  public ResponseEntity<ExternalViewerPageDetailsResponse> externalViewerPageDetails(ViewerTokenDTO viewerTokenDTO) {
    ExternalViewerPageDetailsResponse externalViewerPageDetailsResponse = new ExternalViewerPageDetailsResponse();

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
    playlists = playlists.stream().filter(playlist -> playlist.getSequenceVotes() != -1).filter(playlist -> playlist.getSequenceVisibleCount() == 0).toList();
    playlistGroups = playlistGroups.stream().filter(playlistGroup -> playlistGroup.getSequenceGroupVotes() != -1).filter(playlistGroup -> playlistGroup.getSequenceGroupVisibleCount() == 0).toList();

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
    groupedPlaylists.forEach(playlist -> playlist.setRemoteToken(null));
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
            .locationCode(remotePreference.getLocationCode())
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
    ViewerPageMeta viewerPageMeta = this.viewerPageMetaRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    viewerPageMeta.setRemoteToken(null);
    return viewerPageMeta;
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
    List<RemoteJuke> jukeboxRequestsFromFirstToLast = this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(viewerTokenDTO.getRemoteToken());
    List<PsaSequence> psaSequences = this.psaSequenceRepository.findAllByRemoteToken(viewerTokenDTO.getRemoteToken());
    List<String> psaSequenceNames = psaSequences.stream().map(PsaSequence::getPsaSequenceName).toList();
    long psasInQueue = jukeboxRequestsFromFirstToLast.stream().filter(remoteJuke -> psaSequenceNames.contains(remoteJuke.getNextPlaylist())).count();
    return jukeboxRequestsFromFirstToLast.size() - (int) psasInQueue;
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
    if(remoteJukes.size() > 0) {
      remoteJukes.remove(0);
    }
    return remoteJukes.stream().map(RemoteJuke::getSequence).filter(StringUtils::isNotEmpty).toList();
  }

  public ResponseEntity<AddSequenceResponse> addPlaylistToQueue(ViewerTokenDTO viewerTokenDTO, AddSequenceRequest request) {
    String remoteToken = viewerTokenDTO.getRemoteToken();

    if(StringUtils.isEmpty(request.getSequence())) {
      return ResponseEntity.status(200).build();
    }

    //Get initial data for checks
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
    List<RemoteJuke> jukeboxRequestsFromFirstToLast = this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(remoteToken);
    List<PsaSequence> psaSequences = this.psaSequenceRepository.findAllByRemoteToken(remoteToken);

    //Set data for checks
    int jukeboxDepth = remotePreference.getJukeboxDepth();
    List<String> psaSequenceNames = psaSequences.stream().map(PsaSequence::getPsaSequenceName).toList();
    int numberOfPsasInQueue = (int) jukeboxRequestsFromFirstToLast.stream().filter(remoteJuke -> psaSequenceNames.contains(remoteJuke.getNextPlaylist())).count();

    //Run checks
    //Queue Depth Check - Check is current queue minus PSAs is greater than or equal to the allowable queue depth
    if(jukeboxDepth != 0 && jukeboxRequestsFromFirstToLast.size() >= (jukeboxDepth + numberOfPsasInQueue)) {
      return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("QUEUE_FULL").build());
    }

    //Location Check
    if(remotePreference.getEnableGeolocation()) {
      double distance = this.distance(remotePreference.getRemoteLatitude(), remotePreference.getRemoteLongitude(), request.getViewerLatitude(), request.getViewerLongitude());
      if(distance > remotePreference.getAllowedRadius()) {
        return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("INVALID_LOCATION").build());
      }
    }

    //Currently Playing Check
    Optional<CurrentPlaylist> currentlyPlaying = this.currentPlaylistRepository.findByRemoteToken(remoteToken);
    if(currentlyPlaying.isPresent() && StringUtils.equalsIgnoreCase(currentlyPlaying.get().getCurrentPlaylist(), request.getSequence())) {
      return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("SONG_REQUESTED").build());
    }

    //Request Limit Check
    List<String> jukeboxRequestSequenceNamesFromFirstToLast = jukeboxRequestsFromFirstToLast.stream().map(RemoteJuke::getNextPlaylist).toList();
    List<String> jukeboxRequestSequenceNamesFromLastToFirst = Lists.reverse(jukeboxRequestSequenceNamesFromFirstToLast);
    List<String> sequencesRecentlyRequested = jukeboxRequestSequenceNamesFromLastToFirst.stream().limit(remotePreference.getJukeboxRequestLimit()).toList();
    if(sequencesRecentlyRequested.contains(request.getSequence())) {
      return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("SONG_REQUESTED").build());
    }

    //Request Limit Check for Schedule
    Optional<FppSchedule> fppSchedule = this.fppScheduleRepository.findFirstByRemoteToken(remoteToken);
    if(fppSchedule.isPresent()) {
      if(StringUtils.equalsIgnoreCase(request.getSequence(), fppSchedule.get().getNextScheduledSequence())) {
        return ResponseEntity.status(202).body(AddSequenceResponse.builder().message("SONG_REQUESTED").build());
      }
    }

    //Checks Done
    //Add Request
    int futureRequestSequence = 1;
    List<RemoteJuke> jukeboxRequestsFromLastToFirst = Lists.reverse(jukeboxRequestsFromFirstToLast);
    Optional<RemoteJuke> mostRecentJukeboxRequest = jukeboxRequestsFromLastToFirst.stream().findFirst();
    //Get the highest sequence number for requests, then add one
    if(mostRecentJukeboxRequest.isPresent()) {
      futureRequestSequence = mostRecentJukeboxRequest.get().getFuturePlaylistSequence() + 1;
    }

    //Check if Request is Grouped
    Optional<Playlist> sequenceGroup = this.playlistRepository.findFirstByRemoteTokenAndSequenceGroup(remoteToken, request.getSequence());
    if(sequenceGroup.isPresent()) {
      //It's a group
      List<RemoteJuke> sequencesInGroupToRequest = new ArrayList<>();
      List<Playlist> sequencesInGroup = this.playlistRepository.findAllByRemoteTokenAndSequenceGroupOrderBySequenceOrderAsc(remoteToken, request.getSequence());

      //Iterate through the sequences in the group
      for(Playlist sequence : sequencesInGroup) {
        sequencesInGroupToRequest.add(RemoteJuke.builder()
                .remoteToken(remoteToken)
                .nextPlaylist(sequence.getSequenceName())
                .futurePlaylistSequence(futureRequestSequence)
                .ownerRequested(false)
                .build());
        futureRequestSequence++;
      }
      this.remoteJukeRepository.saveAll(sequencesInGroupToRequest);
    }else {
      //It's not a group, so just a single sequence request
      this.remoteJukeRepository.save(RemoteJuke.builder()
              .remoteToken(remoteToken)
              .nextPlaylist(request.getSequence())
              .futurePlaylistSequence(futureRequestSequence)
              .ownerRequested(false)
              .build());
    }

    //Requests have been added, now for the stats
    this.viewerJukeStatsRepository.save(ViewerJukeStats.builder()
            .remoteToken(remoteToken)
            .playlistName(request.getSequence())
            .requestDateTime(ZonedDateTime.now())
            .build());

    //Add PSA if it is NOT being managed by RF
    if(remotePreference.getPsaEnabled() != null && remotePreference.getPsaEnabled() && !remotePreference.getManagePsa()) {
      //Get next PSA to be played based on the last time the other PSAs were played
      Optional<PsaSequence> psaSequence = this.psaSequenceRepository.findFirstByRemoteTokenOrderByPsaSequenceLastPlayedAscPsaSequenceOrderAsc(remoteToken);
      if(psaSequence.isPresent()) {
        this.addPSAToQueue(remoteToken, remotePreference.getPsaFrequency(), futureRequestSequence, psaSequence.get());
      }
    }

    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<AddSequenceResponse> voteForPlaylist(ViewerTokenDTO viewerTokenDTO, AddSequenceRequest request, HttpServletRequest httpServletRequest) {
    String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
    if(StringUtils.isEmpty(request.getSequence())) {
      return ResponseEntity.status(200).build();
    }
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(viewerTokenDTO.getRemoteToken());
    boolean checkIfVoted = remotePreference.getCheckIfVoted() != null && remotePreference.getCheckIfVoted();
    boolean viewerVoteSaved = false;
    if(checkIfVoted) {
      Optional<RemoteViewerVote> remoteViewerVote = this.remoteViewerVoteRepository.findFirstByRemoteTokenAndViewerIp(viewerTokenDTO.getRemoteToken(), ipAddress);
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
    Optional<Playlist> votedPlaylist = this.playlistRepository.findFirstByRemoteTokenAndSequenceName(viewerTokenDTO.getRemoteToken(), request.getSequence());
    Optional<Playlist> votedPlaylistGroup = this.playlistRepository.findFirstByRemoteTokenAndSequenceGroup(viewerTokenDTO.getRemoteToken(), request.getSequence());
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
    this.saveViewerVoteStats(viewerTokenDTO.getRemoteToken(), request.getSequence());
    return ResponseEntity.status(200).build();
  }

  private List<RemoteJuke> getAllJukeboxRequestsWithDisplayName(String remoteToken) {
    List<RemoteJuke> remoteJukes = this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(remoteToken);
    List<RemoteJuke> allJukeRequests = new ArrayList<>();
    remoteJukes.forEach(juke -> {
      Optional<Playlist> playlist = this.playlistRepository.findFirstByRemoteTokenAndSequenceName(remoteToken, juke.getNextPlaylist());
      playlist.ifPresent(value -> juke.setSequence(value.getSequenceDisplayName()));
      allJukeRequests.add(juke);
    });
    return allJukeRequests;
  }

  private void saveViewerVoteStats(String remoteToken, String playlist) {
    ViewerVoteStats viewerVoteStats = ViewerVoteStats.builder()
            .remoteToken(remoteToken)
            .playlistName(playlist)
            .voteDateTime(ZonedDateTime.now())
            .build();
    this.viewerVoteStatsRepository.save(viewerVoteStats);
  }

  private void addPSAToQueue(String remoteToken, Integer psaFrequency, Integer futureRequestSequence, PsaSequence psaSequence) {
    ZonedDateTime todayOhHundred = ZonedDateTime.now().withHour(0).withMinute(0).withSecond(0);
    int jukeStatsCount = this.viewerJukeStatsRepository.countAllByRemoteTokenAndRequestDateTimeAfter(remoteToken, todayOhHundred);
    if(jukeStatsCount % psaFrequency == 0) {
      futureRequestSequence += 1;
      this.remoteJukeRepository.save(RemoteJuke.builder()
              .remoteToken(remoteToken)
              .futurePlaylistSequence(futureRequestSequence)
              .nextPlaylist(psaSequence.getPsaSequenceName())
              .ownerRequested(false)
              .build());

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
