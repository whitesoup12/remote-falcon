package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresPluginAccess;
import com.remotefalcon.api.request.*;
import com.remotefalcon.api.response.HighestVotedPlaylistResponse;
import com.remotefalcon.api.response.NextPlaylistResponse;
import com.remotefalcon.api.response.PluginResponse;
import com.remotefalcon.api.response.RemotePreferenceResponse;
import com.remotefalcon.api.service.PluginService;
import com.remotefalcon.api.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class PluginController {
  private final PluginService pluginService;
  private final AuthUtil authUtil;

  @Autowired
  public PluginController(PluginService pluginService, AuthUtil authUtil) {
    this.pluginService = pluginService;
    this.authUtil = authUtil;
  }

  @GetMapping(value = "/nextPlaylistInQueue")
  @RequiresPluginAccess
  public ResponseEntity<NextPlaylistResponse> nextPlaylistInQueue(@RequestParam(name = "updateQueue", required = false, defaultValue = "false") Boolean updateQueue) {
    return this.pluginService.nextPlaylistInQueue(updateQueue);
  }

  @PostMapping(value = "/updatePlaylistQueue")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> updatePlaylistQueue() {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    return this.pluginService.updatePlaylistQueue(remoteToken);
  }

  @PostMapping(value = "/syncPlaylists")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> syncPlaylists(@RequestBody SyncPlaylistRequest request) {
    return this.pluginService.syncPlaylists(request);
  }

  @PostMapping(value = "/updateWhatsPlaying")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> updateWhatsPlaying(@RequestBody UpdateWhatsPlayingRequest request) {
    return this.pluginService.updateWhatsPlaying(request);
  }

  @PostMapping(value = "/updateNextScheduledSequence")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> updateNextScheduledSequence(@RequestBody UpdateNextScheduledRequest request) {
    return this.pluginService.updateNextScheduledSequence(request);
  }

  @GetMapping(value = "/viewerControlMode")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> viewerControlMode() {
    return this.pluginService.viewerControlMode();
  }

  @GetMapping(value = "/highestVotedPlaylist")
  @RequiresPluginAccess
  public ResponseEntity<HighestVotedPlaylistResponse> highestVotedPlaylist() {
    return this.pluginService.highestVotedPlaylist();
  }

  @PostMapping(value = "/pluginVersion")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> pluginVersion(@RequestBody PluginVersion request) {
    return this.pluginService.pluginVersion(request);
  }

  @GetMapping(value = "/remotePreferences")
  @RequiresPluginAccess
  public ResponseEntity<RemotePreferenceResponse> remotePreferences() {
    return this.pluginService.remotePreferences();
  }

  @DeleteMapping(value = "/purgeQueue")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> purgeQueue() {
    return this.pluginService.purgeQueue();
  }

  @DeleteMapping(value = "/resetAllVotes")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> resetAllVotes() {
    return this.pluginService.resetAllVotes();
  }

  @PostMapping(value = "/toggleViewerControl")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> toggleViewerControl() {
    return this.pluginService.toggleViewerControl();
  }

  @PostMapping(value = "/updateViewerControl")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> updateViewerControl(@RequestBody ViewerControlRequest request) {
    return this.pluginService.updateViewerControl(request);
  }

  @PostMapping(value = "/updateManagedPsa")
  @RequiresPluginAccess
  public ResponseEntity<PluginResponse> updateManagedPsa(@RequestBody ManagedPSARequest request) {
    return this.pluginService.updateManagedPsa(request);
  }
}
