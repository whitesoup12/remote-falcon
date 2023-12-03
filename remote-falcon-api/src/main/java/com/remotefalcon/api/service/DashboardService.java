package com.remotefalcon.api.service;

import com.remotefalcon.api.dto.TokenDTO;
import com.remotefalcon.api.dto.ViewerTokenDTO;
import com.remotefalcon.api.entity.*;
import com.remotefalcon.api.model.ViewerJukeStatsSequenceRequests;
import com.remotefalcon.api.model.ViewerVoteStatsSequenceVotes;
import com.remotefalcon.api.model.ViewerVoteWinStatsSequenceWins;
import com.remotefalcon.api.repository.*;
import com.remotefalcon.api.request.DashboardRequest;
import com.remotefalcon.api.response.DashboardLiveStats;
import com.remotefalcon.api.response.DashboardStats;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.ExcelUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@Slf4j
public class DashboardService {
  private final ViewerPageStatsRepository viewerPageStatsRepository;
  private final ViewerJukeStatsRepository viewerJukeStatsRepository;
  private final ViewerVoteStatsRepository viewerVoteStatsRepository;
  private final ViewerVoteWinStatsRepository viewerVoteWinStatsRepository;
  private final ActiveViewerRepository activeViewerRepository;
  private final RemotePreferenceRepository remotePreferenceRepository;
  private final RemoteJukeRepository remoteJukeRepository;
  private final ViewerPageService viewerPageService;
  private final AuthUtil jwtUtil;
  private final ExcelUtil excelUtil;

  public DashboardService(ViewerPageStatsRepository viewerPageStatsRepository,
                          ViewerJukeStatsRepository viewerJukeStatsRepository, ViewerVoteStatsRepository viewerVoteStatsRepository,
                          ViewerVoteWinStatsRepository viewerVoteWinStatsRepository, ActiveViewerRepository activeViewerRepository,
                          RemotePreferenceRepository remotePreferenceRepository, RemoteJukeRepository remoteJukeRepository,
                          ViewerPageService viewerPageService, AuthUtil jwtUtil, ExcelUtil excelUtil) {
    this.viewerPageStatsRepository = viewerPageStatsRepository;
    this.viewerJukeStatsRepository = viewerJukeStatsRepository;
    this.viewerVoteStatsRepository = viewerVoteStatsRepository;
    this.viewerVoteWinStatsRepository = viewerVoteWinStatsRepository;
    this.activeViewerRepository = activeViewerRepository;
    this.remoteJukeRepository = remoteJukeRepository;
    this.remotePreferenceRepository = remotePreferenceRepository;
    this.viewerPageService = viewerPageService;
    this.jwtUtil = jwtUtil;
    this.excelUtil = excelUtil;
  }

  public ResponseEntity<DashboardStats> dashboardStats(DashboardRequest dashboardRequest) {
    TokenDTO tokenDTO = this.jwtUtil.getJwtPayload();
    this.parseZonedDateTimeFromDateString(dashboardRequest);
    List<LocalDate> datesBetween = getDatesBetween(dashboardRequest);

    DashboardStats dashboardStats = new DashboardStats();

    //Gather
    CompletableFuture<List<ViewerPageStats>> viewerPageVisitsByDate = CompletableFuture.supplyAsync(() -> viewerPageVisitsByDate(dashboardRequest, tokenDTO.getRemoteToken(), datesBetween));
    CompletableFuture<List<ViewerJukeStats>> jukeboxRequestsByDate = CompletableFuture.supplyAsync(() -> jukeboxRequestsByDate(dashboardRequest, tokenDTO.getRemoteToken(), datesBetween));
    CompletableFuture<ViewerJukeStats> jukeboxRequestsBySequence = CompletableFuture.supplyAsync(() -> jukeboxRequestsBySequence(dashboardRequest, tokenDTO.getRemoteToken()));
    CompletableFuture<List<ViewerVoteStats>> viewerVoteStatsByDate = CompletableFuture.supplyAsync(() -> viewerVoteStatsByDate(dashboardRequest, tokenDTO.getRemoteToken(), datesBetween));
    CompletableFuture<ViewerVoteStats> viewerVoteStatsByPlaylist = CompletableFuture.supplyAsync(() -> viewerVoteStatsByPlaylist(dashboardRequest, tokenDTO.getRemoteToken()));
    CompletableFuture<List<ViewerVoteWinStats>> viewerVoteWinStatsByDate = CompletableFuture.supplyAsync(() -> viewerVoteWinStatsByDate(dashboardRequest, tokenDTO.getRemoteToken(), datesBetween));
    CompletableFuture<ViewerVoteWinStats> viewerVoteWinStatsByPlaylist = CompletableFuture.supplyAsync(() -> viewerVoteWinStatsByPlaylist(dashboardRequest, tokenDTO.getRemoteToken()));

    //Execute
    try {
      dashboardStats.setViewerPageVisitsByDate(viewerPageVisitsByDate.get());
      dashboardStats.setJukeboxRequestsByDate(jukeboxRequestsByDate.get());
      dashboardStats.setJukeboxRequestsBySequence(jukeboxRequestsBySequence.get());
      dashboardStats.setViewerVoteStatsByDate(viewerVoteStatsByDate.get());
      dashboardStats.setViewerVoteStatsBySequence(viewerVoteStatsByPlaylist.get());
      dashboardStats.setViewerVoteWinStatsByDate(viewerVoteWinStatsByDate.get());
      dashboardStats.setViewerVoteWinStatsBySequence(viewerVoteWinStatsByPlaylist.get());
    } catch (ExecutionException | InterruptedException e) {
      log.error("Error getting stats", e);
    }

    return ResponseEntity.status(200).body(dashboardStats);
  }

  public ResponseEntity<DashboardLiveStats> dashboardLiveStats(DashboardRequest dashboardRequest) {
    TokenDTO tokenDTO = this.jwtUtil.getJwtPayload();
    this.parseZonedDateTimeFromDateString(dashboardRequest);
    List<LocalDate> datesBetween = getDatesBetween(dashboardRequest);

    DashboardLiveStats liveStats = new DashboardLiveStats();

    //Gather
    CompletableFuture<Integer> activeViewers = CompletableFuture.supplyAsync(() -> activeViewers(tokenDTO.getRemoteToken()));
    CompletableFuture<Integer> totalViewers = CompletableFuture.supplyAsync(() -> totalViewers(dashboardRequest, tokenDTO.getRemoteToken(), datesBetween));
    CompletableFuture<Integer> currentRequests = CompletableFuture.supplyAsync(() -> currentRequests(tokenDTO.getRemoteToken()));
    CompletableFuture<Integer> totalRequests = CompletableFuture.supplyAsync(() -> totalRequests(dashboardRequest, tokenDTO.getRemoteToken(), datesBetween));

    //Execute
    try {
      liveStats.setActiveViewers(activeViewers.get());
      liveStats.setTotalViewers(totalViewers.get());
      liveStats.setCurrentRequests(currentRequests.get());
      liveStats.setTotalRequests(totalRequests.get());
    } catch (ExecutionException | InterruptedException e) {
      log.error("Error getting live stats", e);
    }

    return ResponseEntity.status(200).body(liveStats);
  }

  private Integer activeViewers(String remoteToken) {
    List<ActiveViewer> activeViewers = this.activeViewerRepository.findAllByRemoteToken(remoteToken);
    List<ActiveViewer> activeViewersFiltered = activeViewers.stream().filter(viewer -> viewer.getLastUpdateDateTime().isAfter(ZonedDateTime.now().minusSeconds(5))).toList();
    List<ActiveViewer> activeViewersToDelete = activeViewers.stream().filter(viewer -> viewer.getLastUpdateDateTime().isBefore(ZonedDateTime.now().minusSeconds(5))).toList();
    this.activeViewerRepository.deleteAll(activeViewersToDelete.stream().toList());
    return activeViewersFiltered.size();
  }

  private Integer totalViewers(DashboardRequest dashboardRequest, String remoteToken, List<LocalDate> datesBetween) {
    List<ViewerPageStats> viewerPageVisitsByDate = this.viewerPageVisitsByDate(dashboardRequest, remoteToken, datesBetween);
    Integer uniqueVisits = 0;
    if(CollectionUtils.isNotEmpty(viewerPageVisitsByDate)) {
      uniqueVisits = viewerPageVisitsByDate.get(0).getUniqueVisits();
    }
    return uniqueVisits;
  }

  private Integer currentRequests(String remoteToken) {
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
    if(StringUtils.equalsIgnoreCase("JUKEBOX", remotePreference.getViewerControlMode())) {
      List<RemoteJuke> remoteJukeList = this.remoteJukeRepository.findAllByRemoteToken(remoteToken);
      return remoteJukeList.size();
    }else {
      List<Playlist> playlists = this.viewerPageService.playlists(ViewerTokenDTO.builder().remoteToken(remoteToken).build());
      int currentVotes = 0;
      if(CollectionUtils.isNotEmpty(playlists)) {
        currentVotes = playlists.stream().mapToInt(Playlist::getSequenceVotes).sum();
      }
      return currentVotes;
    }
  }

  private Integer totalRequests(DashboardRequest dashboardRequest, String remoteToken, List<LocalDate> datesBetween) {
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
    if(StringUtils.equalsIgnoreCase("JUKEBOX", remotePreference.getViewerControlMode())) {
      List<ViewerJukeStats> jukeboxRequestsByDate = this.jukeboxRequestsByDate(dashboardRequest, remoteToken, datesBetween);
      Integer totalRequests = 0;
      if(CollectionUtils.isNotEmpty(jukeboxRequestsByDate)) {
        totalRequests = jukeboxRequestsByDate.get(0).getTotalRequests();
      }
      return totalRequests;
    }else {
      List<ViewerVoteStats> viewerVoteStatsByDate = this.viewerVoteStatsByDate(dashboardRequest, remoteToken, datesBetween);
      Integer totalVotes = 0;
      if(CollectionUtils.isNotEmpty(viewerVoteStatsByDate)) {
        totalVotes = viewerVoteStatsByDate.get(0).getTotalVotes();
      }
      return totalVotes;
    }
  }

  public ResponseEntity<ByteArrayResource> downloadStatsToExcel(DashboardRequest dashboardRequest) {
    ResponseEntity<DashboardStats> dashboardStats = this.dashboardStats(dashboardRequest);
    if(dashboardStats.hasBody()) {
      return excelUtil.generateDashboardExcel(dashboardStats.getBody(), dashboardRequest.getTimezone());
    }
    return ResponseEntity.status(204).build();
  }

  private List<ViewerPageStats> viewerPageVisitsByDate(DashboardRequest dashboardRequest, String remoteToken, List<LocalDate> datesBetween) {
    List<ViewerPageStats> viewerPageStats = this.viewerPageStatsRepository.findAllByRemoteTokenAndPageVisitDateTimeBetween(remoteToken, dashboardRequest.getStartDate(), dashboardRequest.getEndDate());
    Map<LocalDate, List<ViewerPageStats>> viewerPageStatsByDate = viewerPageStats.stream().collect(Collectors.groupingBy(stat ->
            LocalDate.parse(stat.getPageVisitDateTime().withZoneSameInstant(ZoneId.of(dashboardRequest.getTimezone() == null ? "America/Chicago" : dashboardRequest.getTimezone())).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))));

    datesBetween.forEach(date-> {
      LocalDate parsedDate = LocalDate.parse(date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
      if(!viewerPageStatsByDate.containsKey(parsedDate)) {
        viewerPageStatsByDate.put(parsedDate, new ArrayList<>());
      }
    });

    List<ViewerPageStats> viewerPageStatsResponse = new ArrayList<>();
    viewerPageStatsByDate.forEach((key, value) -> {
      int uniqueVisits = value.stream().collect(Collectors.groupingBy(ViewerPageStats::getPageVisitIp)).size();
      viewerPageStatsResponse.add(ViewerPageStats.builder().pageVisitDate(key.atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()).uniqueVisits(uniqueVisits).totalVisits(value.size()).build());
    });
    return viewerPageStatsResponse.stream().sorted(Comparator.comparing(ViewerPageStats::getPageVisitDate)).collect(Collectors.toList());
  }

  private List<ViewerJukeStats> jukeboxRequestsByDate(DashboardRequest dashboardRequest, String remoteToken, List<LocalDate> datesBetween) {
    List<ViewerJukeStats> viewerJukeStats = this.viewerJukeStatsRepository.findAllByRemoteTokenAndRequestDateTimeBetween(remoteToken, dashboardRequest.getStartDate(), dashboardRequest.getEndDate());
    Map<LocalDate, List<ViewerJukeStats>> viewerJukeStatsByDate = viewerJukeStats.stream().collect(Collectors.groupingBy(stat ->
            LocalDate.parse(stat.getRequestDateTime().withZoneSameInstant(ZoneId.of(dashboardRequest.getTimezone() == null ? "America/Chicago" : dashboardRequest.getTimezone())).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))));

    datesBetween.forEach(date-> {
      LocalDate parsedDate = LocalDate.parse(date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
      if(!viewerJukeStatsByDate.containsKey(parsedDate)) {
        viewerJukeStatsByDate.put(parsedDate, new ArrayList<>());
      }
    });

    List<ViewerJukeStats> viewerJukeStatsResponse = new ArrayList<>();
    viewerJukeStatsByDate.forEach((key, value) -> {
      Map<String, List<ViewerJukeStats>> sequenceRequests = value.stream().collect(Collectors.groupingBy(ViewerJukeStats::getPlaylistName));
      List<ViewerJukeStatsSequenceRequests> viewerJukeStatsSequenceRequests = new ArrayList<>();
      sequenceRequests.forEach((key1, value1) -> viewerJukeStatsSequenceRequests.add(ViewerJukeStatsSequenceRequests.builder().sequenceName(key1).sequenceRequests(value1.size()).build()));
      List<ViewerJukeStatsSequenceRequests> viewerJukeStatsSequenceRequestsSorted = viewerJukeStatsSequenceRequests.stream().sorted(Comparator.comparing(ViewerJukeStatsSequenceRequests::getSequenceRequests).reversed()).toList();
      viewerJukeStatsResponse.add(ViewerJukeStats.builder().requestDate(key.atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()).totalRequests(value.size()).sequenceRequests(viewerJukeStatsSequenceRequestsSorted).build());
    });
    return viewerJukeStatsResponse.stream().sorted(Comparator.comparing(ViewerJukeStats::getRequestDate)).collect(Collectors.toList());
  }

  private ViewerJukeStats jukeboxRequestsBySequence(DashboardRequest dashboardRequest, String remoteToken) {
    List<ViewerJukeStats> viewerJukeStats = this.viewerJukeStatsRepository.findAllByRemoteTokenAndRequestDateTimeBetween(remoteToken, dashboardRequest.getStartDate(), dashboardRequest.getEndDate());
    Map<String, List<ViewerJukeStats>> viewerJukeStatsBySequence = viewerJukeStats.stream().collect(Collectors.groupingBy(ViewerJukeStats::getPlaylistName));
    ViewerJukeStats viewerJukeStatsRespone = new ViewerJukeStats();
    List<ViewerJukeStatsSequenceRequests> viewerJukeStatsSequenceRequests = new ArrayList<>();
    viewerJukeStatsBySequence.forEach((key, value) -> viewerJukeStatsSequenceRequests.add(ViewerJukeStatsSequenceRequests.builder().sequenceName(key).sequenceRequests(value.size()).build()));
    List<ViewerJukeStatsSequenceRequests> viewerJukeStatsSequenceRequestsSorted = viewerJukeStatsSequenceRequests.stream().sorted(Comparator.comparing(ViewerJukeStatsSequenceRequests::getSequenceRequests).reversed()).collect(Collectors.toList());
    viewerJukeStatsRespone.setSequenceRequests(viewerJukeStatsSequenceRequestsSorted);
    return viewerJukeStatsRespone;
  }

  private List<ViewerVoteStats> viewerVoteStatsByDate(DashboardRequest dashboardRequest, String remoteToken, List<LocalDate> datesBetween) {
    List<ViewerVoteStats> viewerVoteStats = this.viewerVoteStatsRepository.findAllByRemoteTokenAndVoteDateTimeBetween(remoteToken, dashboardRequest.getStartDate(), dashboardRequest.getEndDate());
    Map<LocalDate, List<ViewerVoteStats>> viewerVoteStatsByDate = viewerVoteStats.stream().collect(Collectors.groupingBy(stat ->
            LocalDate.parse(stat.getVoteDateTime().withZoneSameInstant(ZoneId.of(dashboardRequest.getTimezone() == null ? "America/Chicago" : dashboardRequest.getTimezone())).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))));

    datesBetween.forEach(date-> {
      LocalDate parsedDate = LocalDate.parse(date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
      if(!viewerVoteStatsByDate.containsKey(parsedDate)) {
        viewerVoteStatsByDate.put(parsedDate, new ArrayList<>());
      }
    });

    List<ViewerVoteStats> viewerVoteStatsResponse = new ArrayList<>();
    viewerVoteStatsByDate.forEach((key, value) -> {
      Map<String, List<ViewerVoteStats>> sequenceVotes = value.stream().collect(Collectors.groupingBy(ViewerVoteStats::getPlaylistName));
      List<ViewerVoteStatsSequenceVotes> viewerVoteStatsSequenceVotes = new ArrayList<>();
      sequenceVotes.forEach((key1, value1) -> viewerVoteStatsSequenceVotes.add(ViewerVoteStatsSequenceVotes.builder().sequenceName(key1).sequenceVotes(value1.size()).build()));
      viewerVoteStatsResponse.add(ViewerVoteStats.builder().voteDate(key.atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()).totalVotes(value.size()).sequenceVotes(viewerVoteStatsSequenceVotes).build());
    });
    return viewerVoteStatsResponse.stream().sorted(Comparator.comparing(ViewerVoteStats::getVoteDate)).collect(Collectors.toList());
  }

  private ViewerVoteStats viewerVoteStatsByPlaylist(DashboardRequest dashboardRequest, String remoteToken) {
    List<ViewerVoteStats> viewerVoteStats = this.viewerVoteStatsRepository.findAllByRemoteTokenAndVoteDateTimeBetween(remoteToken, dashboardRequest.getStartDate(), dashboardRequest.getEndDate());
    Map<String, List<ViewerVoteStats>> viewerVoteStatsBySequence = viewerVoteStats.stream().collect(Collectors.groupingBy(ViewerVoteStats::getPlaylistName));
    ViewerVoteStats viewerVoteStatsResponse = new ViewerVoteStats();
    List<ViewerVoteStatsSequenceVotes> viewerVoteStatsSequenceVotes = new ArrayList<>();
    viewerVoteStatsBySequence.forEach((key, value) -> viewerVoteStatsSequenceVotes.add(ViewerVoteStatsSequenceVotes.builder().sequenceName(key).sequenceVotes(value.size()).build()));
    List<ViewerVoteStatsSequenceVotes> viewerVoteStatsSequenceVotesSorted = viewerVoteStatsSequenceVotes.stream().sorted(Comparator.comparing(ViewerVoteStatsSequenceVotes::getSequenceVotes).reversed()).collect(Collectors.toList());
    viewerVoteStatsResponse.setSequenceVotes(viewerVoteStatsSequenceVotesSorted);
    return viewerVoteStatsResponse;
  }

  private List<ViewerVoteWinStats> viewerVoteWinStatsByDate(DashboardRequest dashboardRequest, String remoteToken, List<LocalDate> datesBetween) {
    List<ViewerVoteWinStats> viewerVoteWinStats = this.viewerVoteWinStatsRepository.findAllByRemoteTokenAndVoteWinDateTimeBetween(remoteToken, dashboardRequest.getStartDate(), dashboardRequest.getEndDate());
    Map<LocalDate, List<ViewerVoteWinStats>> viewerVoteWinStatsByDate = viewerVoteWinStats.stream().collect(Collectors.groupingBy(stat ->
            LocalDate.parse(stat.getVoteWinDateTime().withZoneSameInstant(ZoneId.of(dashboardRequest.getTimezone() == null ? "America/Chicago" : dashboardRequest.getTimezone())).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))));

    datesBetween.forEach(date-> {
      LocalDate parsedDate = LocalDate.parse(date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
      if(!viewerVoteWinStatsByDate.containsKey(parsedDate)) {
        viewerVoteWinStatsByDate.put(parsedDate, new ArrayList<>());
      }
    });

    List<ViewerVoteWinStats> viewerVoteWinStatsResponse = new ArrayList<>();
    viewerVoteWinStatsByDate.forEach((key, value) -> {
      Map<String, List<ViewerVoteWinStats>> sequenceWins = value.stream().collect(Collectors.groupingBy(ViewerVoteWinStats::getPlaylistName));
      List<ViewerVoteWinStatsSequenceWins> viewerVoteWinStatsSequenceWins = new ArrayList<>();
      sequenceWins.forEach((key1, value1) -> viewerVoteWinStatsSequenceWins.add(ViewerVoteWinStatsSequenceWins.builder().sequenceName(key1).sequenceWins(value1.size()).build()));
      viewerVoteWinStatsResponse.add(ViewerVoteWinStats.builder().voteDate(key.atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()).totalVotes(value.size()).sequenceWins(viewerVoteWinStatsSequenceWins).build());
    });
    return viewerVoteWinStatsResponse.stream().sorted(Comparator.comparing(ViewerVoteWinStats::getVoteDate)).collect(Collectors.toList());
  }

  private ViewerVoteWinStats viewerVoteWinStatsByPlaylist(DashboardRequest dashboardRequest, String remoteToken) {
    List<ViewerVoteWinStats> viewerVoteWinStats = this.viewerVoteWinStatsRepository.findAllByRemoteTokenAndVoteWinDateTimeBetween(remoteToken, dashboardRequest.getStartDate(), dashboardRequest.getEndDate());
    Map<String, List<ViewerVoteWinStats>> viewerVoteWinStatsBySequence = viewerVoteWinStats.stream().collect(Collectors.groupingBy(ViewerVoteWinStats::getPlaylistName));
    ViewerVoteWinStats viewerVoteWinStatsResponse = new ViewerVoteWinStats();
    List<ViewerVoteWinStatsSequenceWins> viewerVoteWinStatsSequenceWins = new ArrayList<>();
    viewerVoteWinStatsBySequence.forEach((key, value) -> viewerVoteWinStatsSequenceWins.add(ViewerVoteWinStatsSequenceWins.builder().sequenceName(key).sequenceWins(value.size()).build()));
    List<ViewerVoteWinStatsSequenceWins> viewerVoteWinStatsSequenceWinsSorted = viewerVoteWinStatsSequenceWins.stream().sorted(Comparator.comparing(ViewerVoteWinStatsSequenceWins::getSequenceWins).reversed()).collect(Collectors.toList());
    viewerVoteWinStatsResponse.setSequenceWins(viewerVoteWinStatsSequenceWinsSorted);
    return viewerVoteWinStatsResponse;
  }

  private void parseZonedDateTimeFromDateString(DashboardRequest dashboardRequest) {
    dashboardRequest.setStartDate(ZonedDateTime.ofInstant(Instant.ofEpochMilli(dashboardRequest.getStartDateMillis()), ZoneId.of(dashboardRequest.getTimezone() == null ? "America/Chicago" : dashboardRequest.getTimezone())));
    dashboardRequest.setEndDate(ZonedDateTime.ofInstant(Instant.ofEpochMilli(dashboardRequest.getEndDateMillis()), ZoneId.of(dashboardRequest.getTimezone() == null ? "America/Chicago" : dashboardRequest.getTimezone())));
  }

  private List<LocalDate> getDatesBetween(DashboardRequest dashboardRequest) {
    LocalDate localDateStart = dashboardRequest.getStartDate().toLocalDate();
    LocalDate localDateEnd = dashboardRequest.getEndDate().toLocalDate().plusDays(1);
    return localDateStart.datesUntil(localDateEnd).toList();
  }
}
