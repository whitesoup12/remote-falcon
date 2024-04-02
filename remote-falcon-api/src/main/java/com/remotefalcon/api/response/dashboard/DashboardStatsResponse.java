package com.remotefalcon.api.response.dashboard;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class DashboardStatsResponse {
  private List<Stat> page;
  private List<Stat> jukeboxByDate;
  private Stat jukeboxBySequence;
  private List<Stat> votingByDate;
  private Stat votingBySequence;
  private List<Stat> votingWinByDate;
  private Stat votingWinBySequence;

  @Data
  @Builder
  public static class Stat {
    private Long date;
    private Integer total;
    private Integer unique;
    private List<Sequence> sequences;
  }

  @Data
  @Builder
  public static class Sequence {
    private String name;
    private Integer total;
  }
}
