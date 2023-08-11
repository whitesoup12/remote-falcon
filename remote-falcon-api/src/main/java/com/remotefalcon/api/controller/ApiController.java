package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresApiAccess;
import com.remotefalcon.api.aop.RequiresPluginAccess;
import com.remotefalcon.api.request.api.AddSequenceApiRequest;
import com.remotefalcon.api.response.NextPlaylistResponse;
import com.remotefalcon.api.response.api.CurrentlyPlayingResponse;
import com.remotefalcon.api.response.api.PreferencesResponse;
import com.remotefalcon.api.response.api.QueueDepthResponse;
import com.remotefalcon.api.response.api.SequencesResponse;
import com.remotefalcon.api.service.ApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
public class ApiController {
  private final ApiService apiService;

  @Autowired
  public ApiController(ApiService apiService) {
    this.apiService = apiService;
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/preferences")
  @RequiresApiAccess
  public ResponseEntity<PreferencesResponse> preferences(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.preferences(subdomain);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/sequences")
  @RequiresApiAccess
  public ResponseEntity<List<SequencesResponse>> sequences(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.sequences(subdomain);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/currentlyPlaying")
  @RequiresApiAccess
  public ResponseEntity<CurrentlyPlayingResponse> currentlyPlaying(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.currentlyPlaying(subdomain);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/nextSequenceInQueue")
  @RequiresApiAccess
  public ResponseEntity<CurrentlyPlayingResponse> nextSequenceInQueue(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.nextSequenceInQueue(subdomain);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/allSequencesInQueue")
  @RequiresApiAccess
  public ResponseEntity<List<String>> allSequencesInQueue(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.allSequencesInQueue(subdomain);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/currentQueueDepth")
  @RequiresApiAccess
  public ResponseEntity<QueueDepthResponse> currentQueueDepth(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.currentQueueDepth(subdomain);
  }

  @PostMapping(value = "/external/subdomain/{subdomain}/addSequenceToQueue")
  @RequiresApiAccess
  public ResponseEntity<?> addSequenceToQueue(@PathVariable(name = "subdomain") String subdomain, @RequestBody AddSequenceApiRequest request) {
    return this.apiService.addSequenceToQueue(subdomain, request);
  }

  @PostMapping(value = "/external/subdomain/{subdomain}/voteForSequence")
  @RequiresApiAccess
  public ResponseEntity<?> voteForSequence(@PathVariable(name = "subdomain") String subdomain, @RequestBody AddSequenceApiRequest request, HttpServletRequest httpServletRequest) {
    return this.apiService.voteForSequence(subdomain, request, httpServletRequest);
  }
}
