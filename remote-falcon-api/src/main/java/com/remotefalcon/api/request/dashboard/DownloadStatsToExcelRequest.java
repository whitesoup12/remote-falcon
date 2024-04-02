package com.remotefalcon.api.request.dashboard;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class DownloadStatsToExcelRequest {
  private String timezone;
}
