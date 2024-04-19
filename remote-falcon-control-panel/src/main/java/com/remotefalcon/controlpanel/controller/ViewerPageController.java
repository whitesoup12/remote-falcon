package com.remotefalcon.controlpanel.controller;

import com.remotefalcon.controlpanel.aop.RequiresViewerAccess;
import com.remotefalcon.controlpanel.dto.ViewerTokenDTO;
import com.remotefalcon.controlpanel.entity.Playlist;
import com.remotefalcon.controlpanel.entity.ViewerPageMeta;
import com.remotefalcon.controlpanel.request.AddSequenceRequest;
import com.remotefalcon.controlpanel.request.ViewerPageVisitRequest;
import com.remotefalcon.controlpanel.response.AddSequenceResponse;
import com.remotefalcon.controlpanel.response.ExternalViewerPageDetailsResponse;
import com.remotefalcon.controlpanel.response.ViewerRemotePreferencesResponse;
import com.remotefalcon.controlpanel.service.ViewerPageService;
import com.remotefalcon.controlpanel.util.AuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ViewerPageController {
  @Autowired
  private ViewerPageService viewerPageService;
  @Autowired
  private AuthUtil authUtil;

  @GetMapping(value = "/viewer/externalViewerPageDetails")
  @RequiresViewerAccess
  public ResponseEntity<ExternalViewerPageDetailsResponse> externalViewerPageDetails() {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    return this.viewerPageService.externalViewerPageDetails(viewerTokenDTO);
  }

  @GetMapping(value = "/viewer/playlists")
  @RequiresViewerAccess
  public ResponseEntity<List<Playlist>> playlists() {
    return this.viewerPageService.playlists();
  }

  @GetMapping(value = "/viewer/viewerPageContents")
  @RequiresViewerAccess
  public ResponseEntity<String> viewerPageContents() {
    return this.viewerPageService.viewerPageContents();
  }

  @GetMapping(value = "/viewer/remotePrefs")
  @RequiresViewerAccess
  public ResponseEntity<ViewerRemotePreferencesResponse> remotePrefs() {
    return this.viewerPageService.remotePrefs();
  }

  @PostMapping(value = "/viewer/updateActiveViewer")
  @RequiresViewerAccess
  @SneakyThrows
  public ResponseEntity<?> updateActiveViewer(HttpServletRequest httpServletRequest) {
    return this.viewerPageService.updateActiveViewer(httpServletRequest);
  }

  @GetMapping(value = "/viewer/whatsPlaying")
  @RequiresViewerAccess
  public ResponseEntity<String> whatsPlaying() {
    return this.viewerPageService.whatsPlaying();
  }

  @PostMapping(value = "/viewer/insertViewerPageStats")
  @RequiresViewerAccess
  public ResponseEntity<?> insertViewerPageStats(@RequestBody ViewerPageVisitRequest request, HttpServletRequest httpServletRequest) {
    return this.viewerPageService.insertViewerPageStats(request, httpServletRequest);
  }

  @GetMapping(value = "/viewer/getViewerPageMeta")
  @RequiresViewerAccess
  public ResponseEntity<ViewerPageMeta> getViewerPageMeta() {
    return this.viewerPageService.getViewerPageMeta();
  }

  @GetMapping(value = "/viewer/nextPlaylistInQueue")
  @RequiresViewerAccess
  public ResponseEntity<String> nextPlaylistInQueue() {
    return this.viewerPageService.nextPlaylistInQueue();
  }

  @GetMapping(value = "/viewer/currentQueueDepth")
  @RequiresViewerAccess
  public ResponseEntity<Integer> currentQueueDepth() {
    return this.viewerPageService.currentQueueDepth();
  }

  @GetMapping(value = "/viewer/allJukeboxRequests")
  @RequiresViewerAccess
  public ResponseEntity<List<String>> allJukeboxRequests() {
    return this.viewerPageService.allJukeboxRequests();
  }

  @PostMapping(value = "/viewer/addPlaylistToQueue")
  @RequiresViewerAccess
  public ResponseEntity<AddSequenceResponse> addPlaylistToQueue(@RequestBody AddSequenceRequest request) {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    return this.viewerPageService.addPlaylistToQueue(viewerTokenDTO, request);
  }

  @PostMapping(value = "/viewer/voteForPlaylist")
  @RequiresViewerAccess
  public ResponseEntity<AddSequenceResponse> voteForPlaylist(@RequestBody AddSequenceRequest request, HttpServletRequest httpServletRequest) {
    ViewerTokenDTO viewerTokenDTO = this.authUtil.getViewerJwtPayload();
    if(viewerTokenDTO == null) {
      return ResponseEntity.status(401).build();
    }
    return this.viewerPageService.voteForPlaylist(viewerTokenDTO,  request, httpServletRequest);
  }
}
