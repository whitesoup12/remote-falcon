package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresAccess;
import com.remotefalcon.api.request.dashboard.DownloadStatsToExcelRequest;
import com.remotefalcon.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardController {
  private final DashboardService dashboardService;

  @PostMapping(value = "/controlPanel/downloadStatsToExcel")
  @RequiresAccess
  public ResponseEntity<ByteArrayResource> downloadStatsToExcel(@RequestBody DownloadStatsToExcelRequest downloadStatsToExcelRequest) {
    return this.dashboardService.downloadStatsToExcel(downloadStatsToExcelRequest.getTimezone());
  }
}
