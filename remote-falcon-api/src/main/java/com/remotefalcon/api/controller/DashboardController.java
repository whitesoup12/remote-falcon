package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresAccess;
import com.remotefalcon.api.request.DashboardRequest;
import com.remotefalcon.api.response.DashboardStats;
import com.remotefalcon.api.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

  @GetMapping(value = "/controlPanel/activeViewers")
  @RequiresAccess
  public ResponseEntity<Integer> activeViewers() {
    return this.dashboardService.activeViewers();
  }

  @PostMapping(value = "/controlPanel/totalViewers")
  @RequiresAccess()
  public ResponseEntity<Integer> totalViewers(@RequestBody DashboardRequest dashboardRequest) {
    return this.dashboardService.totalViewers(dashboardRequest);
  }

  @GetMapping(value = "/controlPanel/currentRequests")
  @RequiresAccess
  public ResponseEntity<Integer> currentRequests() {
    return this.dashboardService.currentRequests();
  }

  @PostMapping(value = "/controlPanel/totalRequests")
  @RequiresAccess()
  public ResponseEntity<Integer> totalRequests(@RequestBody DashboardRequest dashboardRequest) {
    return this.dashboardService.totalRequests(dashboardRequest);
  }

  @PostMapping(value = "/controlPanel/downloadStatsToExcel")
  @RequiresAccess
  public ResponseEntity<ByteArrayResource> downloadStatsToExcel(@RequestBody DashboardRequest dashboardRequest) {
    return this.dashboardService.downloadStatsToExcel(dashboardRequest);
  }
}
