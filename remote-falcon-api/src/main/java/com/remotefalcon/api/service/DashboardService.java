package com.remotefalcon.api.service;

import com.remotefalcon.api.documents.Show;
import com.remotefalcon.api.documents.models.Stat;
import com.remotefalcon.api.dto.TokenDTO;
import com.remotefalcon.api.enums.StatusResponse;
import com.remotefalcon.api.repository.mongo.ShowRepository;
import com.remotefalcon.api.response.dashboard.DashboardLiveStatsResponse;
import com.remotefalcon.api.response.dashboard.DashboardStatsResponse;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.ExcelUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {
  private final AuthUtil jwtUtil;
  private final ExcelUtil excelUtil;
  private final ShowRepository showRepository;

  public DashboardStatsResponse dashboardStats(Long startDate, Long endDate, String timezone, Boolean fillDays) {
    TokenDTO tokenDTO = this.jwtUtil.getJwtPayload();
    Optional<Show> show = this.showRepository.findByShowToken(tokenDTO.getShowToken());
    if(show.isEmpty()) {
      throw new RuntimeException(StatusResponse.SHOW_NOT_FOUND.name());
    }

    ZonedDateTime startDateAtZone = ZonedDateTime.ofInstant(Instant.ofEpochMilli(startDate), ZoneId.of(timezone));
    ZonedDateTime endDateAtZone = ZonedDateTime.ofInstant(Instant.ofEpochMilli(endDate), ZoneId.of(timezone));

    List<DashboardStatsResponse.Stat> pageStats = this.buildPageStats(startDateAtZone, endDateAtZone, timezone, show.get(), fillDays);
    List<DashboardStatsResponse.Stat> jukeboxStatsByDate = this.buildJukeboxStatsByDate(startDateAtZone, endDateAtZone, timezone, show.get(), fillDays);
    DashboardStatsResponse.Stat jukeboxStatsBySequence = this.buildJukeboxStatsBySequence(startDateAtZone, endDateAtZone, show.get());
    List<DashboardStatsResponse.Stat> voteStatsByDate = this.buildVoteStatsByDate(startDateAtZone, endDateAtZone, timezone, show.get(), fillDays);
    DashboardStatsResponse.Stat voteStatsBySequence = this.buildVoteStatsBySequence(startDateAtZone, endDateAtZone, show.get());
    List<DashboardStatsResponse.Stat> voteWinStatsByDate = this.buildVoteWinStatsByDate(startDateAtZone, endDateAtZone, timezone, show.get(), fillDays);
    DashboardStatsResponse.Stat voteWinStatsBySequence = this.buildVoteWinStatsBySequence(startDateAtZone, endDateAtZone, show.get());

    return DashboardStatsResponse.builder()
            .page(pageStats)
            .jukeboxByDate(jukeboxStatsByDate)
            .jukeboxBySequence(jukeboxStatsBySequence)
            .votingByDate(voteStatsByDate)
            .votingBySequence(voteStatsBySequence)
            .votingWinByDate(voteWinStatsByDate)
            .votingWinBySequence(voteWinStatsBySequence)
            .build();
  }

  public DashboardLiveStatsResponse dashboardLiveStats(Long startDate, Long endDate, String timezone) {
    TokenDTO tokenDTO = this.jwtUtil.getJwtPayload();
    Optional<Show> show = this.showRepository.findByShowToken(tokenDTO.getShowToken());
    if(show.isEmpty()) {
      throw new RuntimeException(StatusResponse.SHOW_NOT_FOUND.name());
    }

    ZonedDateTime startDateAtZone = ZonedDateTime.ofInstant(Instant.ofEpochMilli(startDate), ZoneId.of(timezone));
    ZonedDateTime endDateAtZone = ZonedDateTime.ofInstant(Instant.ofEpochMilli(endDate), ZoneId.of(timezone));

    return DashboardLiveStatsResponse.builder()
            .activeViewers(0) // TODO
            .totalViewers(this.buildTotalViewersLiveStat(startDateAtZone, endDateAtZone, timezone, show.get(), false))
            .currentRequests(0) // TODO
            .totalRequests(0) // TODO
            .build();
  }

  public ResponseEntity<ByteArrayResource> downloadStatsToExcel(String timezone) {
    DashboardStatsResponse dashboardStats = this.dashboardStats(21600000L, 4102380000000L, timezone, false);
    if(dashboardStats != null) {
      return excelUtil.generateDashboardExcel(dashboardStats, timezone);
    }
    return ResponseEntity.status(204).build();
  }

  private List<DashboardStatsResponse.Stat> buildPageStats(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, String timezone, Show show, Boolean fillDays) {
    List<DashboardStatsResponse.Stat> pageStats = new ArrayList<>();

    Map<LocalDate, List<Stat.Page>> pageStatsGroupedByDate = show.getStat().getPage()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(stat -> stat.getDateTime().toLocalDate()));

    if(fillDays) {
      this.fillStatDateGaps(startDateAtZone, endDateAtZone, pageStatsGroupedByDate);
    }

    pageStatsGroupedByDate.forEach((date, stat) -> pageStats.add(DashboardStatsResponse.Stat.builder()
            .date(ZonedDateTime.of(date, date.atStartOfDay().toLocalTime(), ZoneId.of(timezone)).toInstant().toEpochMilli())
            .total(stat.size())
            .unique(stat.stream().collect(Collectors.groupingBy(Stat.Page::getIp)).size())
            .build()));

    pageStats.sort(Comparator.comparing(DashboardStatsResponse.Stat::getDate));

    return pageStats;
  }

  private List<DashboardStatsResponse.Stat> buildJukeboxStatsByDate(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, String timezone, Show show, Boolean fillDays) {
    List<DashboardStatsResponse.Stat> jukeboxStats = new ArrayList<>();

    Map<LocalDate, List<Stat.Jukebox>> jukeboxStatsGroupedByDate = show.getStat().getJukebox()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(stat -> stat.getDateTime().toLocalDate()));

    if(fillDays) {
      this.fillStatDateGaps(startDateAtZone, endDateAtZone, jukeboxStatsGroupedByDate);
    }

    jukeboxStatsGroupedByDate.forEach((date, stat) -> {
      List<DashboardStatsResponse.Sequence> sequences = new ArrayList<>();
      Map<String, List<Stat.Jukebox>> requests = stat.stream()
              .collect(Collectors.groupingBy(Stat.Jukebox::getName));
      requests.forEach((sequence, request) -> sequences.add(DashboardStatsResponse.Sequence.builder()
              .total(request.size())
              .name(sequence)
              .build()));
      jukeboxStats.add(DashboardStatsResponse.Stat.builder()
              .sequences(sequences.stream()
                      .sorted(Comparator.comparing(DashboardStatsResponse.Sequence::getTotal).reversed())
                      .toList())
              .date(ZonedDateTime.of(date, date.atStartOfDay().toLocalTime(), ZoneId.of(timezone)).toInstant().toEpochMilli())
              .total(stat.size())
              .build());
    });

    jukeboxStats.sort(Comparator.comparing(DashboardStatsResponse.Stat::getDate));

    return jukeboxStats;
  }

  private DashboardStatsResponse.Stat buildJukeboxStatsBySequence(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, Show show) {
    List<DashboardStatsResponse.Sequence> sequences = new ArrayList<>();

    Map<String, List<Stat.Jukebox>> jukeboxStatsGroupedBySequence = show.getStat().getJukebox()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(Stat.Jukebox::getName));

    jukeboxStatsGroupedBySequence.forEach((sequence, stat) -> sequences.add(DashboardStatsResponse.Sequence.builder()
            .total(stat.size())
            .name(sequence)
            .build()));

    sequences.sort(Comparator.comparing(DashboardStatsResponse.Sequence::getTotal).reversed());

    return DashboardStatsResponse.Stat.builder()
            .sequences(sequences)
            .build();
  }

  private List<DashboardStatsResponse.Stat> buildVoteStatsByDate(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, String timezone, Show show, Boolean fillDays) {
    List<DashboardStatsResponse.Stat> votingStats = new ArrayList<>();

    Map<LocalDate, List<Stat.Voting>> votingStatsGroupedByDate = show.getStat().getVoting()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(stat -> stat.getDateTime().toLocalDate()));

    if(fillDays) {
      this.fillStatDateGaps(startDateAtZone, endDateAtZone, votingStatsGroupedByDate);
    }

    votingStatsGroupedByDate.forEach((date, stat) -> {
      List<DashboardStatsResponse.Sequence> sequences = new ArrayList<>();
      Map<String, List<Stat.Voting>> votes = stat.stream()
              .collect(Collectors.groupingBy(Stat.Voting::getName));
      votes.forEach((sequence, vote) -> sequences.add(DashboardStatsResponse.Sequence.builder()
              .total(vote.size())
              .name(sequence)
              .build()));
      votingStats.add(DashboardStatsResponse.Stat.builder()
              .sequences(sequences.stream()
                      .sorted(Comparator.comparing(DashboardStatsResponse.Sequence::getTotal).reversed())
                      .toList())
              .date(ZonedDateTime.of(date, date.atStartOfDay().toLocalTime(), ZoneId.of(timezone)).toInstant().toEpochMilli())
              .total(stat.size())
              .build());
    });

    votingStats.sort(Comparator.comparing(DashboardStatsResponse.Stat::getDate));

    return votingStats;
  }

  private DashboardStatsResponse.Stat buildVoteStatsBySequence(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, Show show) {
    List<DashboardStatsResponse.Sequence> sequences = new ArrayList<>();

    Map<String, List<Stat.Voting>> voteStatsGroupedBySequence = show.getStat().getVoting()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(Stat.Voting::getName));

    voteStatsGroupedBySequence.forEach((sequence, stat) -> sequences.add(DashboardStatsResponse.Sequence.builder()
            .total(stat.size())
            .name(sequence)
            .build()));

    sequences.sort(Comparator.comparing(DashboardStatsResponse.Sequence::getTotal).reversed());

    return DashboardStatsResponse.Stat.builder()
            .sequences(sequences)
            .build();
  }

  private List<DashboardStatsResponse.Stat> buildVoteWinStatsByDate(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, String timezone, Show show, Boolean fillDays) {
    List<DashboardStatsResponse.Stat> votingWinStats = new ArrayList<>();

    Map<LocalDate, List<Stat.VotingWin>> votingWinStatsGroupedByDate = show.getStat().getVotingWin()
            .stream()
            .sorted(Comparator.comparing(Stat.VotingWin::getDateTime))
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(stat -> stat.getDateTime().toLocalDate()));

    if(fillDays) {
      this.fillStatDateGaps(startDateAtZone, endDateAtZone, votingWinStatsGroupedByDate);
    }

    votingWinStatsGroupedByDate.forEach((date, stat) -> {
      List<DashboardStatsResponse.Sequence> sequences = new ArrayList<>();
      Map<String, List<Stat.VotingWin>> voteWins = stat.stream()
              .collect(Collectors.groupingBy(Stat.VotingWin::getName));
      voteWins.forEach((sequence, win) -> sequences.add(DashboardStatsResponse.Sequence.builder()
              .total(win.size())
              .name(sequence)
              .build()));
      votingWinStats.add(DashboardStatsResponse.Stat.builder()
              .sequences(sequences.stream()
                      .sorted(Comparator.comparing(DashboardStatsResponse.Sequence::getTotal).reversed())
                      .toList())
              .date(ZonedDateTime.of(date, date.atStartOfDay().toLocalTime(), ZoneId.of(timezone)).toInstant().toEpochMilli())
              .total(stat.size())
              .build());
    });

    votingWinStats.sort(Comparator.comparing(DashboardStatsResponse.Stat::getDate));

    return votingWinStats;
  }

  private DashboardStatsResponse.Stat buildVoteWinStatsBySequence(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, Show show) {
    List<DashboardStatsResponse.Sequence> sequences = new ArrayList<>();

    Map<String, List<Stat.VotingWin>> voteWinStatsGroupedBySequence = show.getStat().getVotingWin()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(Stat.VotingWin::getName));

    voteWinStatsGroupedBySequence.forEach((sequence, stat) -> sequences.add(DashboardStatsResponse.Sequence.builder()
            .total(stat.size())
            .name(sequence)
            .build()));

    sequences.sort(Comparator.comparing(DashboardStatsResponse.Sequence::getTotal).reversed());

    return DashboardStatsResponse.Stat.builder()
            .sequences(sequences)
            .build();
  }

  private Integer buildTotalViewersLiveStat(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, String timezone, Show show, Boolean fillDays) {
    List<DashboardStatsResponse.Stat> pageStats = new ArrayList<>();

    Map<LocalDate, List<Stat.Page>> pageStatsGroupedByDate = show.getStat().getPage()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(stat -> stat.getDateTime().toLocalDate()));

    if(fillDays) {
      this.fillStatDateGaps(startDateAtZone, endDateAtZone, pageStatsGroupedByDate);
    }

    pageStatsGroupedByDate.forEach((date, stat) -> pageStats.add(DashboardStatsResponse.Stat.builder()
            .date(ZonedDateTime.of(date, date.atStartOfDay().toLocalTime(), ZoneId.of(timezone)).toInstant().toEpochMilli())
            .total(stat.size())
            .unique(stat.stream().collect(Collectors.groupingBy(Stat.Page::getIp)).size())
            .build()));

    return pageStats.stream()
            .mapToInt(DashboardStatsResponse.Stat::getUnique)
            .sum();
  }

  private <V> void fillStatDateGaps(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, Map<LocalDate, V> statMap) {
    List<LocalDate> datesInRange = startDateAtZone.toLocalDate().datesUntil(endDateAtZone.toLocalDate()).toList();
    datesInRange.forEach(date -> {
      if(!statMap.containsKey(date)) {
        statMap.put(date, (V) new ArrayList<>());
      }
    });
  }
}
