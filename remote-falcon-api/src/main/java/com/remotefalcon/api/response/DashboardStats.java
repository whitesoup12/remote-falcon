package com.remotefalcon.api.response;

import com.remotefalcon.api.entity.ViewerJukeStats;
import com.remotefalcon.api.entity.ViewerPageStats;
import com.remotefalcon.api.entity.ViewerVoteStats;
import com.remotefalcon.api.entity.ViewerVoteWinStats;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
  List<ViewerPageStats> viewerPageVisitsByDate;
  List<ViewerJukeStats> jukeboxRequestsByDate;
  ViewerJukeStats jukeboxRequestsBySequence;
  List<ViewerVoteStats> viewerVoteStatsByDate;
  ViewerVoteStats viewerVoteStatsBySequence;
  List<ViewerVoteWinStats> viewerVoteWinStatsByDate;
  ViewerVoteWinStats viewerVoteWinStatsBySequence;
}
