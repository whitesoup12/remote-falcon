package com.remotefalcon.controlpanel.response;

import com.remotefalcon.controlpanel.entity.ViewerJukeStats;
import com.remotefalcon.controlpanel.entity.ViewerPageStats;
import com.remotefalcon.controlpanel.entity.ViewerVoteStats;
import com.remotefalcon.controlpanel.entity.ViewerVoteWinStats;
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
