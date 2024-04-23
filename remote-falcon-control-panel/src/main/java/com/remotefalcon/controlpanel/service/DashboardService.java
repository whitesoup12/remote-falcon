package com.remotefalcon.controlpanel.service;

import com.remotefalcon.library.documents.Show;
import com.remotefalcon.library.models.ActiveViewer;
import com.remotefalcon.library.models.Stat;
import com.remotefalcon.controlpanel.dto.TokenDTO;
import com.remotefalcon.library.enums.StatusResponse;
import com.remotefalcon.controlpanel.repository.mongo.ShowRepository;
import com.remotefalcon.controlpanel.response.dashboard.DashboardLiveStatsResponse;
import com.remotefalcon.controlpanel.response.dashboard.DashboardStatsResponse;
import com.remotefalcon.controlpanel.util.AuthUtil;
import com.remotefalcon.controlpanel.util.ExcelUtil;
import com.remotefalcon.library.models.Vote;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.*;
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

    List<ActiveViewer> filteredActiveViewers = show.get().getActiveViewers().stream()
            .filter(activeViewer -> activeViewer.getVisitDateTime().isAfter(LocalDateTime.now().minusMinutes(1)))
            .toList();
    show.get().setActiveViewers(filteredActiveViewers);
    this.showRepository.save(show.get());

    return DashboardLiveStatsResponse.builder()
            .activeViewers(filteredActiveViewers.size())
            .totalViewers(this.buildTotalViewersLiveStat(startDateAtZone, endDateAtZone, timezone, show.get(), false))
            .currentRequests(show.get().getRequests().size())
            .totalRequests(this.buildTotalRequestsLiveStat(startDateAtZone, endDateAtZone, timezone, show.get(), false))
            .currentVotes(show.get().getVotes().stream().mapToInt(Vote::getVotes).sum())
            .totalVotes(this.buildTotalVotesLiveStat(startDateAtZone, endDateAtZone, timezone, show.get(), false))
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

    Map<LocalDate, List<Stat.Page>> pageStatsGroupedByDate = show.getStats().getPage()
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

    Map<LocalDate, List<Stat.Jukebox>> jukeboxStatsGroupedByDate = show.getStats().getJukebox()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(stat -> stat.getDateTime().toLocalDate()));

    if(fillDays) {
      this.fillStatDateGaps(startDateAtZone, endDateAtZone, jukeboxStatsGroupedByDate);
    }

    jukeboxStatsGroupedByDate.forEach((date, stat) -> {
      List<DashboardStatsResponse.SequenceStat> sequences = new ArrayList<>();
      Map<String, List<Stat.Jukebox>> requests = stat.stream()
              .collect(Collectors.groupingBy(Stat.Jukebox::getName));
      requests.forEach((sequence, request) -> sequences.add(DashboardStatsResponse.SequenceStat.builder()
              .total(request.size())
              .name(sequence)
              .build()));
      jukeboxStats.add(DashboardStatsResponse.Stat.builder()
              .sequences(sequences.stream()
                      .sorted(Comparator.comparing(DashboardStatsResponse.SequenceStat::getTotal).reversed())
                      .toList())
              .date(ZonedDateTime.of(date, date.atStartOfDay().toLocalTime(), ZoneId.of(timezone)).toInstant().toEpochMilli())
              .total(stat.size())
              .build());
    });

    jukeboxStats.sort(Comparator.comparing(DashboardStatsResponse.Stat::getDate));

    return jukeboxStats;
  }

  private DashboardStatsResponse.Stat buildJukeboxStatsBySequence(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, Show show) {
    List<DashboardStatsResponse.SequenceStat> sequences = new ArrayList<>();

    Map<String, List<Stat.Jukebox>> jukeboxStatsGroupedBySequence = show.getStats().getJukebox()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(Stat.Jukebox::getName));

    jukeboxStatsGroupedBySequence.forEach((sequence, stat) -> sequences.add(DashboardStatsResponse.SequenceStat.builder()
            .total(stat.size())
            .name(sequence)
            .build()));

    sequences.sort(Comparator.comparing(DashboardStatsResponse.SequenceStat::getTotal).reversed());

    return DashboardStatsResponse.Stat.builder()
            .sequences(sequences)
            .build();
  }

  private List<DashboardStatsResponse.Stat> buildVoteStatsByDate(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, String timezone, Show show, Boolean fillDays) {
    List<DashboardStatsResponse.Stat> votingStats = new ArrayList<>();

    Map<LocalDate, List<Stat.Voting>> votingStatsGroupedByDate = show.getStats().getVoting()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(stat -> stat.getDateTime().toLocalDate()));

    if(fillDays) {
      this.fillStatDateGaps(startDateAtZone, endDateAtZone, votingStatsGroupedByDate);
    }

    votingStatsGroupedByDate.forEach((date, stat) -> {
      List<DashboardStatsResponse.SequenceStat> sequences = new ArrayList<>();
      Map<String, List<Stat.Voting>> votes = stat.stream()
              .collect(Collectors.groupingBy(Stat.Voting::getName));
      votes.forEach((sequence, vote) -> sequences.add(DashboardStatsResponse.SequenceStat.builder()
              .total(vote.size())
              .name(sequence)
              .build()));
      votingStats.add(DashboardStatsResponse.Stat.builder()
              .sequences(sequences.stream()
                      .sorted(Comparator.comparing(DashboardStatsResponse.SequenceStat::getTotal).reversed())
                      .toList())
              .date(ZonedDateTime.of(date, date.atStartOfDay().toLocalTime(), ZoneId.of(timezone)).toInstant().toEpochMilli())
              .total(stat.size())
              .build());
    });

    votingStats.sort(Comparator.comparing(DashboardStatsResponse.Stat::getDate));

    return votingStats;
  }

  private DashboardStatsResponse.Stat buildVoteStatsBySequence(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, Show show) {
    List<DashboardStatsResponse.SequenceStat> sequences = new ArrayList<>();

    Map<String, List<Stat.Voting>> voteStatsGroupedBySequence = show.getStats().getVoting()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(Stat.Voting::getName));

    voteStatsGroupedBySequence.forEach((sequence, stat) -> sequences.add(DashboardStatsResponse.SequenceStat.builder()
            .total(stat.size())
            .name(sequence)
            .build()));

    sequences.sort(Comparator.comparing(DashboardStatsResponse.SequenceStat::getTotal).reversed());

    return DashboardStatsResponse.Stat.builder()
            .sequences(sequences)
            .build();
  }

  private List<DashboardStatsResponse.Stat> buildVoteWinStatsByDate(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, String timezone, Show show, Boolean fillDays) {
    List<DashboardStatsResponse.Stat> votingWinStats = new ArrayList<>();

    Map<LocalDate, List<Stat.VotingWin>> votingWinStatsGroupedByDate = show.getStats().getVotingWin()
            .stream()
            .sorted(Comparator.comparing(Stat.VotingWin::getDateTime))
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(stat -> stat.getDateTime().toLocalDate()));

    if(fillDays) {
      this.fillStatDateGaps(startDateAtZone, endDateAtZone, votingWinStatsGroupedByDate);
    }

    votingWinStatsGroupedByDate.forEach((date, stat) -> {
      List<DashboardStatsResponse.SequenceStat> sequences = new ArrayList<>();
      Map<String, List<Stat.VotingWin>> voteWins = stat.stream()
              .collect(Collectors.groupingBy(Stat.VotingWin::getName));
      voteWins.forEach((sequence, win) -> sequences.add(DashboardStatsResponse.SequenceStat.builder()
              .total(win.size())
              .name(sequence)
              .build()));
      votingWinStats.add(DashboardStatsResponse.Stat.builder()
              .sequences(sequences.stream()
                      .sorted(Comparator.comparing(DashboardStatsResponse.SequenceStat::getTotal).reversed())
                      .toList())
              .date(ZonedDateTime.of(date, date.atStartOfDay().toLocalTime(), ZoneId.of(timezone)).toInstant().toEpochMilli())
              .total(stat.size())
              .build());
    });

    votingWinStats.sort(Comparator.comparing(DashboardStatsResponse.Stat::getDate));

    return votingWinStats;
  }

  private DashboardStatsResponse.Stat buildVoteWinStatsBySequence(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, Show show) {
    List<DashboardStatsResponse.SequenceStat> sequences = new ArrayList<>();

    Map<String, List<Stat.VotingWin>> voteWinStatsGroupedBySequence = show.getStats().getVotingWin()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(Stat.VotingWin::getName));

    voteWinStatsGroupedBySequence.forEach((sequence, stat) -> sequences.add(DashboardStatsResponse.SequenceStat.builder()
            .total(stat.size())
            .name(sequence)
            .build()));

    sequences.sort(Comparator.comparing(DashboardStatsResponse.SequenceStat::getTotal).reversed());

    return DashboardStatsResponse.Stat.builder()
            .sequences(sequences)
            .build();
  }

  private Integer buildTotalViewersLiveStat(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, String timezone, Show show, Boolean fillDays) {
    List<DashboardStatsResponse.Stat> pageStats = new ArrayList<>();

    Map<LocalDate, List<Stat.Page>> pageStatsGroupedByDate = show.getStats().getPage()
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

  private Integer buildTotalRequestsLiveStat(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, String timezone, Show show, Boolean fillDays) {
    List<DashboardStatsResponse.Stat> jukeboxStats = new ArrayList<>();

    Map<LocalDate, List<Stat.Jukebox>> jukeboxStatsGroupedByDate = show.getStats().getJukebox()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(stat -> stat.getDateTime().toLocalDate()));

    if(fillDays) {
      this.fillStatDateGaps(startDateAtZone, endDateAtZone, jukeboxStatsGroupedByDate);
    }

    jukeboxStatsGroupedByDate.forEach((date, stat) -> jukeboxStats.add(DashboardStatsResponse.Stat.builder()
            .date(ZonedDateTime.of(date, date.atStartOfDay().toLocalTime(), ZoneId.of(timezone)).toInstant().toEpochMilli())
            .total(stat.size())
            .unique(stat.stream().collect(Collectors.groupingBy(Stat.Jukebox::getName)).size())
            .build()));

    return jukeboxStats.stream()
            .mapToInt(DashboardStatsResponse.Stat::getTotal)
            .sum();
  }

  private Integer buildTotalVotesLiveStat(ZonedDateTime startDateAtZone, ZonedDateTime endDateAtZone, String timezone, Show show, Boolean fillDays) {
    List<DashboardStatsResponse.Stat> voteStats = new ArrayList<>();

    Map<LocalDate, List<Stat.Voting>> voteStatsGroupedByDate = show.getStats().getVoting()
            .stream()
            .filter(stat -> stat.getDateTime().isAfter(startDateAtZone.toLocalDateTime()))
            .filter(stat -> stat.getDateTime().isBefore(endDateAtZone.toLocalDateTime()))
            .collect(Collectors.groupingBy(stat -> stat.getDateTime().toLocalDate()));

    if(fillDays) {
      this.fillStatDateGaps(startDateAtZone, endDateAtZone, voteStatsGroupedByDate);
    }

    voteStatsGroupedByDate.forEach((date, stat) -> voteStats.add(DashboardStatsResponse.Stat.builder()
            .date(ZonedDateTime.of(date, date.atStartOfDay().toLocalTime(), ZoneId.of(timezone)).toInstant().toEpochMilli())
            .total(stat.size())
            .unique(stat.stream().collect(Collectors.groupingBy(Stat.Voting::getName)).size())
            .build()));

    return voteStats.stream()
            .mapToInt(DashboardStatsResponse.Stat::getTotal)
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
