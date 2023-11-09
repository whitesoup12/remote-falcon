package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresApiAccess;
import com.remotefalcon.api.dto.ViewerTokenDTO;
import com.remotefalcon.api.entity.ExternalApiAccess;
import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.repository.RemoteRepository;
import com.remotefalcon.api.request.AddSequenceRequest;
import com.remotefalcon.api.request.api.AddSequenceApiRequest;
import com.remotefalcon.api.response.ExternalViewerPageDetailsResponse;
import com.remotefalcon.api.response.api.CurrentlyPlayingResponse;
import com.remotefalcon.api.response.api.PreferencesResponse;
import com.remotefalcon.api.response.api.QueueDepthResponse;
import com.remotefalcon.api.response.api.SequencesResponse;
import com.remotefalcon.api.service.ApiService;
import com.remotefalcon.api.service.ViewerPageService;
import com.remotefalcon.api.util.AuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ApiController {
  private final ApiService apiService;
  private final ViewerPageService viewerPageService;
  private final AuthUtil authUtil;
  private final RemoteRepository remoteRepository;

  @Autowired
  public ApiController(ApiService apiService, ViewerPageService viewerPageService, AuthUtil authUtil, RemoteRepository remoteRepository) {
    this.apiService = apiService;
    this.viewerPageService = viewerPageService;
    this.authUtil = authUtil;
    this.remoteRepository = remoteRepository;
  }

  @GetMapping(value = "/external/showDetails")
  @RequiresApiAccess
  public ResponseEntity<ExternalViewerPageDetailsResponse> showDetails() {
    ViewerTokenDTO viewerTokenDTO = this.getViewerTokenDTO();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    return this.viewerPageService.externalViewerPageDetails(viewerTokenDTO);
  }

  @PostMapping(value = "/external/addSequenceToQueue")
  @RequiresApiAccess
  @Deprecated
  public ResponseEntity<?> addSequenceToQueuev2(@RequestBody AddSequenceRequest request) {
    ViewerTokenDTO viewerTokenDTO = this.getViewerTokenDTO();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    return this.viewerPageService.addPlaylistToQueue(viewerTokenDTO, request);
  }

  @PostMapping(value = "/external/voteForSequence")
  @RequiresApiAccess
  @Deprecated
  public ResponseEntity<?> voteForSequencev2(@RequestBody AddSequenceRequest request, HttpServletRequest httpServletRequest) {
    ViewerTokenDTO viewerTokenDTO = this.getViewerTokenDTO();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    return this.viewerPageService.voteForPlaylist(viewerTokenDTO, request, httpServletRequest);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/preferences")
  @RequiresApiAccess
  @Deprecated
  public ResponseEntity<PreferencesResponse> preferences(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.preferences(subdomain);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/sequences")
  @RequiresApiAccess
  @Deprecated
  public ResponseEntity<List<SequencesResponse>> sequences(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.sequences(subdomain);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/currentlyPlaying")
  @RequiresApiAccess
  @Deprecated
  public ResponseEntity<CurrentlyPlayingResponse> currentlyPlaying(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.currentlyPlaying(subdomain);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/nextSequenceInQueue")
  @RequiresApiAccess
  @Deprecated
  public ResponseEntity<CurrentlyPlayingResponse> nextSequenceInQueue(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.nextSequenceInQueue(subdomain);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/allSequencesInQueue")
  @RequiresApiAccess
  @Deprecated
  public ResponseEntity<List<String>> allSequencesInQueue(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.allSequencesInQueue(subdomain);
  }

  @GetMapping(value = "/external/subdomain/{subdomain}/currentQueueDepth")
  @RequiresApiAccess
  @Deprecated
  public ResponseEntity<QueueDepthResponse> currentQueueDepth(@PathVariable(name = "subdomain") String subdomain) {
    return this.apiService.currentQueueDepth(subdomain);
  }

  @PostMapping(value = "/external/subdomain/{subdomain}/addSequenceToQueue")
  @RequiresApiAccess
  @Deprecated
  public ResponseEntity<?> addSequenceToQueue(@PathVariable(name = "subdomain") String subdomain, @RequestBody AddSequenceApiRequest request) {
    return this.apiService.addSequenceToQueue(subdomain, request);
  }

  @PostMapping(value = "/external/subdomain/{subdomain}/voteForSequence")
  @RequiresApiAccess
  @Deprecated
  public ResponseEntity<?> voteForSequence(@PathVariable(name = "subdomain") String subdomain, @RequestBody AddSequenceApiRequest request, HttpServletRequest httpServletRequest) {
    return this.apiService.voteForSequence(subdomain, request, httpServletRequest);
  }

  private ViewerTokenDTO getViewerTokenDTO() {
    ExternalApiAccess externalApiAccess = this.authUtil.getApiAccessFromApiJwt();
    Remote remote = this.remoteRepository.findByRemoteToken(externalApiAccess.getRemoteToken());
    return ViewerTokenDTO.builder()
            .remoteToken(remote.getRemoteToken())
            .subdomain(remote.getRemoteSubdomain())
            .build();

  }
}
