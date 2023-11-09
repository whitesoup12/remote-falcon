package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresViewerAccess;
import com.remotefalcon.api.dto.ViewerTokenDTO;
import com.remotefalcon.api.entity.Playlist;
import com.remotefalcon.api.entity.ViewerPageMeta;
import com.remotefalcon.api.request.AddSequenceRequest;
import com.remotefalcon.api.request.ViewerPageVisitRequest;
import com.remotefalcon.api.response.AddSequenceResponse;
import com.remotefalcon.api.response.ExternalViewerPageDetailsResponse;
import com.remotefalcon.api.response.ViewerRemotePreferencesResponse;
import com.remotefalcon.api.service.ViewerPageService;
import com.remotefalcon.api.util.AuthUtil;
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
