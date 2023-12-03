package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresAccess;
import com.remotefalcon.api.request.DashboardRequest;
import com.remotefalcon.api.response.DashboardLiveStats;
import com.remotefalcon.api.response.DashboardStats;
import com.remotefalcon.api.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {
  private final DashboardService dashboardService;

  @Autowired
  public DashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }

  @PostMapping(value = "/controlPanel/dashboardStats")
  @RequiresAccess()
  public ResponseEntity<DashboardStats> dashboardStats(@RequestBody DashboardRequest dashboardRequest) {
    return this.dashboardService.dashboardStats(dashboardRequest);
  }

  @PostMapping(value = "/controlPanel/dashboardLiveStats")
  @RequiresAccess()
  public ResponseEntity<DashboardLiveStats> dashboardLiveStats(@RequestBody DashboardRequest dashboardRequest) {
    return this.dashboardService.dashboardLiveStats(dashboardRequest);
  }

  @PostMapping(value = "/controlPanel/downloadStatsToExcel")
  @RequiresAccess
  public ResponseEntity<ByteArrayResource> downloadStatsToExcel(@RequestBody DashboardRequest dashboardRequest) {
    return this.dashboardService.downloadStatsToExcel(dashboardRequest);
  }
}
