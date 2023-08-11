package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresAccess;
import com.remotefalcon.api.aop.RequiresAdminAccess;
import com.remotefalcon.api.entity.*;
import com.remotefalcon.api.model.Comments;
import com.remotefalcon.api.model.WorkItemCommentDetails;
import com.remotefalcon.api.request.*;
import com.remotefalcon.api.response.ADOWorkItemResponse;
import com.remotefalcon.api.response.PublicViewerPagesResponse;
import com.remotefalcon.api.response.RemoteResponse;
import com.remotefalcon.api.service.ControlPanelService;
import org.azd.workitemtracking.types.WorkItemList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
public class ControlPanelController {
  private final ControlPanelService controlPanelService;

  @Autowired
  public ControlPanelController(ControlPanelService controlPanelService) {
    this.controlPanelService = controlPanelService;
  }

  @GetMapping(value = "/controlPanel/isJwtValid")
  @RequiresAccess()
  public ResponseEntity<?> isJwtValid() {
    return ResponseEntity.status(200).build();
  }

  @GetMapping(value = "/controlPanel/coreInfo")
  @RequiresAccess()
  public ResponseEntity<RemoteResponse> coreInfo() {
    return this.controlPanelService.coreInfo();
  }

  @DeleteMapping(value = "/controlPanel/deleteViewerStats")
  @RequiresAccess
  public ResponseEntity<?> deleteViewerStats() {
    return this.controlPanelService.deleteViewerStats();
  }

  @PostMapping(value = "/controlPanel/updateActiveTheme")
  @RequiresAccess
  public ResponseEntity<?> updateActiveTheme(@RequestBody ActiveThemeRequest request) {
    return this.controlPanelService.updateActiveTheme(request);
  }

  @PostMapping(value = "/controlPanel/updatePassword")
  @RequiresAccess
  public ResponseEntity<?> updatePassword(HttpServletRequest httpServletRequest) {
    return this.controlPanelService.updatePassword(httpServletRequest);
  }

  @PostMapping(value = "/controlPanel/updateShowName")
  @RequiresAccess
  public ResponseEntity<?> updateShowName(@RequestBody UpdateShowName request) {
    return this.controlPanelService.updateShowName(request);
  }

  @PostMapping(value = "/controlPanel/userProfile")
  @RequiresAccess
  public ResponseEntity<UserProfile> userProfile(@RequestBody UserProfile request) {
    return this.controlPanelService.userProfile(request);
  }

  @PostMapping(value = "/controlPanel/requestApiAccess")
  @RequiresAccess
  public ResponseEntity<?> requestApiAccess() {
    return this.controlPanelService.requestApiAccess();
  }

  @DeleteMapping(value = "/controlPanel/deleteAccount")
  @RequiresAccess
  public ResponseEntity<?> deleteAccount() {
    return this.controlPanelService.deleteAccount();
  }

  @GetMapping(value = "/controlPanel/remotePrefs")
  @RequiresAccess
  public ResponseEntity<RemotePreference> remotePrefs() {
    return this.controlPanelService.remotePrefs();
  }

  @GetMapping(value = "/controlPanel/sequences")
  @RequiresAccess
  public ResponseEntity<List<Playlist>> sequences() {
    return this.controlPanelService.sequences();
  }

  @GetMapping(value = "/controlPanel/inactiveSequences")
  @RequiresAccess
  public ResponseEntity<List<Playlist>> inactiveSequences() {
    return this.controlPanelService.inactiveSequences();
  }

  @GetMapping(value = "/controlPanel/currentQueueDepth")
  @RequiresAccess
  public ResponseEntity<Integer> currentQueueDepth() {
    return this.controlPanelService.currentQueueDepth();
  }

  @PostMapping(value = "/controlPanel/customLocation")
  @RequiresAccess
  public ResponseEntity<?> customLocation(@RequestBody CustomLocationRequest request) {
    return this.controlPanelService.customLocation(request);
  }

  @PostMapping(value = "/controlPanel/remotePrefs")
  @RequiresAccess
  public ResponseEntity<?> saveRemotePrefs(@RequestBody RemotePreference request) {
    return this.controlPanelService.saveRemotePrefs(request);
  }

  @GetMapping(value = "/controlPanel/allJukeboxRequests")
  @RequiresAccess
  public ResponseEntity<List<RemoteJuke>> allJukeboxRequests() {
    return this.controlPanelService.allJukeboxRequests();
  }

  @DeleteMapping(value = "/controlPanel/purgeQueue")
  @RequiresAccess
  public ResponseEntity<?> purgeQueue() {
    return this.controlPanelService.purgeQueue();
  }

  @DeleteMapping(value = "/controlPanel/deleteJukeboxRequest/{remoteJukeKey}")
  @RequiresAccess
  public ResponseEntity<?> deleteJukeboxRequest(@PathVariable(name = "remoteJukeKey") Long remoteJukeKey) {
    return this.controlPanelService.deleteJukeboxRequest(remoteJukeKey);
  }

  @DeleteMapping(value = "/controlPanel/resetAllVotes")
  @RequiresAccess
  public ResponseEntity<?> resetAllVotes() {
    return this.controlPanelService.resetAllVotes();
  }

  @GetMapping(value = "/controlPanel/getViewerPageMeta")
  @RequiresAccess
  public ResponseEntity<ViewerPageMeta> getViewerPageMeta() {
    return this.controlPanelService.getViewerPageMeta();
  }

  @PostMapping(value = "/controlPanel/saveViewerPageMeta")
  @RequiresAccess
  public ResponseEntity<ViewerPageMeta> saveViewerPageMeta(@RequestBody ViewerPageMeta request) {
    return this.controlPanelService.saveViewerPageMeta(request);
  }

  @GetMapping(value = "/controlPanel/checkViewerPageModified")
  @RequiresAccess
  public ResponseEntity<Boolean> checkViewerPageModified() {
    return this.controlPanelService.checkViewerPageModified();
  }

  @PostMapping(value = "/controlPanel/updateViewerPagePublic")
  @RequiresAccess
  public ResponseEntity<?> updateViewerPagePublic(@RequestBody ViewerPagePublicRequest request) {
    return this.controlPanelService.updateViewerPagePublic(request);
  }

  @GetMapping(value = "/controlPanel/getDefaultViewerPageContent")
  @RequiresAccess
  public ResponseEntity<String> getDefaultViewerPageContent() {
    return this.controlPanelService.getDefaultViewerPageContent();
  }

  @GetMapping(value = "/controlPanel/getViewerPageContent")
  @RequiresAccess
  public ResponseEntity<String> getViewerPageContent() {
    return this.controlPanelService.getViewerPageContent();
  }

  @PostMapping(value = "/controlPanel/saveViewerPageContent")
  @RequiresAccess
  public ResponseEntity<?> saveViewerPageContent(@RequestBody Remote request) {
    return this.controlPanelService.saveViewerPageContent(request);
  }

  @PostMapping(value = "/controlPanel/saveRemoteViewerPage")
  @RequiresAccess
  public ResponseEntity<?> saveRemoteViewerPage(@RequestBody RemoteViewerPages request) {
    return this.controlPanelService.saveRemoteViewerPage(request);
  }

  @PostMapping(value = "/controlPanel/toggleSequenceVisibility")
  @RequiresAccess
  public ResponseEntity<?> toggleSequenceVisibility(@RequestBody SequenceKeyRequest request) {
    return this.controlPanelService.toggleSequenceVisibility(request);
  }

  @DeleteMapping(value = "/controlPanel/deleteSequence/{sequenceKey}")
  @RequiresAccess
  public ResponseEntity<?> deleteSequence(@PathVariable(name = "sequenceKey") Long sequenceKey) {
    return this.controlPanelService.deleteSequence(sequenceKey);
  }

  @DeleteMapping(value = "/controlPanel/deleteAllInactiveSequences")
  @RequiresAccess
  public ResponseEntity<?> deleteAllInactiveSequences() {
    return this.controlPanelService.deleteAllInactiveSequences();
  }

  @PostMapping(value = "/controlPanel/playSequence")
  @RequiresAccess
  public ResponseEntity<?> playSequence(@RequestBody SequenceKeyRequest request) {
    return this.controlPanelService.playSequence(request);
  }

  @PostMapping(value = "/controlPanel/updateSequenceOrder")
  @RequiresAccess
  public ResponseEntity<?> updateSequenceOrder(@RequestBody List<Playlist> request) {
    return this.controlPanelService.updateSequenceOrder(request);
  }

  @PostMapping(value = "/controlPanel/updateSequenceDetails")
  @RequiresAccess
  public ResponseEntity<?> updateSequenceDetails(@RequestBody List<Playlist> sequences) {
    return this.controlPanelService.updateSequenceDetails(sequences);
  }

  @GetMapping(value = "/controlPanel/publicViewerPagesCount")
  @RequiresAccess
  public ResponseEntity<Integer> publicViewerPagesCount() {
    return this.controlPanelService.publicViewerPagesCount();
  }

  @GetMapping(value = "/controlPanel/publicViewerPages/{page}")
  @RequiresAccess
  public ResponseEntity<List<PublicViewerPagesResponse>> publicViewerPages(@PathVariable(name = "page") Integer page) {
    return this.controlPanelService.publicViewerPages(page);
  }

  @GetMapping(value = "/controlPanel/viewerPagesHearted")
  @RequiresAccess
  public ResponseEntity<List<PageGalleryHearts>> viewerPagesHearted() {
    return this.controlPanelService.viewerPagesHearted();
  }

  @GetMapping(value = "/controlPanel/viewerPageHeartCounts")
  @RequiresAccess
  public ResponseEntity<List<PageGalleryHearts>> viewerPageHeartCounts() {
    return this.controlPanelService.viewerPageHeartCounts();
  }

  @PostMapping(value = "/controlPanel/toggleViewerPageHeart")
  @RequiresAccess
  public ResponseEntity<?> toggleViewerPageHeart(@RequestBody PageGalleryHearts request) {
    return this.controlPanelService.toggleViewerPageHeart(request);
  }

  @GetMapping(value = "/controlPanel/getViewerPageBySubdomain/{remoteSubdomain}")
  @RequiresAccess
  public ResponseEntity<String> getViewerPageBySubdomain(@PathVariable(name = "remoteSubdomain") String remoteSubdomain) {
    return this.controlPanelService.getViewerPageBySubdomain(remoteSubdomain);
  }

  @GetMapping(value = "/controlPanel/sequenceGroups")
  @RequiresAccess
  public ResponseEntity<List<PlaylistGroup>> getSequenceGroups() {
    return this.controlPanelService.getSequenceGroups();
  }

  @PostMapping(value = "/controlPanel/sequenceGroups")
  @RequiresAccess
  public ResponseEntity<?> saveSequenceGroup(@RequestBody PlaylistGroup request) {
    return this.controlPanelService.saveSequenceGroup(request);
  }

  @DeleteMapping(value = "/controlPanel/sequenceGroups/{sequenceGroupKey}")
  @RequiresAccess
  public ResponseEntity<?> saveSequenceGroup(@PathVariable(name = "sequenceGroupKey") Long sequenceGroupKey) {
    return this.controlPanelService.deleteSequenceGroup(sequenceGroupKey);
  }

  @GetMapping(value = "/controlPanel/remoteViewerPages")
  @RequiresAccess
  public ResponseEntity<List<RemoteViewerPages>> getRemoteViewerPages() {
    return this.controlPanelService.getRemoteViewerPages();
  }

  @PostMapping(value = "/controlPanel/addRemoteViewerPage")
  @RequiresAccess
  public ResponseEntity<RemoteViewerPages> addRemoteViewerPage(@RequestBody RemoteViewerPages request) {
    return this.controlPanelService.addRemoteViewerPage(request);
  }

  @DeleteMapping(value = "/controlPanel/deleteRemoteViewerPage/{remoteViewerPageKey}")
  @RequiresAccess
  public ResponseEntity<?> deleteRemoteViewerPage(@PathVariable(name = "remoteViewerPageKey") Long remoteViewerPageKey) {
    return this.controlPanelService.deleteRemoteViewerPage(remoteViewerPageKey);
  }

  @GetMapping(value = "/controlPanel/remoteViewerPageTemplates")
  @RequiresAccess
  public ResponseEntity<List<RemoteViewerPageTemplates>> getRemoteViewerPageTemplates() {
    return this.controlPanelService.getRemoteViewerPageTemplates();
  }

  @PostMapping(value = "/controlPanel/importantAnalytics")
  @RequiresAccess
  public ResponseEntity<?> easterEggFound() {
    return this.controlPanelService.easterEggFound();
  }

  @PostMapping(value = "/controlPanel/notifications/allUsers")
  @RequiresAdminAccess
  public ResponseEntity<?> createNotificationAllUsers(@RequestBody Notifications notification) {
    return this.controlPanelService.createNotificationAllUsers(notification);
  }

  @PostMapping(value = "/controlPanel/notifications/user/{remoteToken}")
  @RequiresAdminAccess
  public ResponseEntity<?> createNotificationSingleUser(@RequestBody Notifications notification, @PathVariable(name = "remoteToken") String remoteToken) {
    return this.controlPanelService.createNotificationSingleUser(notification, remoteToken);
  }

  @GetMapping(value = "/controlPanel/notifications")
  @RequiresAccess
  public ResponseEntity<List<Notifications>> getNotifications() {
    return this.controlPanelService.getNotifications();
  }

  @PostMapping(value = "/controlPanel/notifications/markAsRead/{notificationKey}")
  @RequiresAccess
  public ResponseEntity<?> markNotificationAsRead(@PathVariable(name = "notificationKey") Long notificationKey) {
    return this.controlPanelService.markNotificationAsRead(notificationKey);
  }

  @PostMapping(value = "/controlPanel/notifications/markAllAsRead")
  @RequiresAccess
  public ResponseEntity<?> markAllNotificationsAsRead() {
    return this.controlPanelService.markAllNotificationsAsRead();
  }

  @DeleteMapping(value = "/controlPanel/notifications/{notificationKey}")
  @RequiresAccess
  public ResponseEntity<?> deleteNotification(@PathVariable(name = "notificationKey") Long notificationKey) {
    return this.controlPanelService.deleteNotification(notificationKey);
  }

  @GetMapping(value = "/controlPanel/getAdoWorkItems/raw")
  @RequiresAccess
  public ResponseEntity<WorkItemList> getAdoWorkItemsRaw() {
    return this.controlPanelService.getAdoWorkItemsRaw();
  }

  @GetMapping(value = "/controlPanel/getAdoWorkItems")
  @RequiresAccess
  public ResponseEntity<List<ADOWorkItemResponse>> getAdoWorkItems() {
    return this.controlPanelService.getAdoWorkItems();
  }

  @GetMapping(value = "/controlPanel/getAdoWorkItemComments/{workItemId}")
  @RequiresAccess
  public ResponseEntity<List<Comments>> getAdoWorkItemComments(@PathVariable(name = "workItemId") Integer workItemId) {
    return this.controlPanelService.getAdoWorkItemComments(workItemId);
  }

  @PostMapping(value = "/controlPanel/editAdoWorkItem/{workItemId}")
  @RequiresAccess
  public ResponseEntity<?> editAdoWorkItem(@PathVariable(name = "workItemId") Integer workItemId, @RequestBody ADOWorkItemRequest adoWorkItemRequest) {
    return this.controlPanelService.editAdoWorkItem(workItemId, adoWorkItemRequest);
  }

  @PostMapping(value = "/controlPanel/createAdoWorkItem")
  @RequiresAccess
  public ResponseEntity<?> createAdoWorkItem(@RequestBody ADOWorkItemRequest adoWorkItemRequest) {
    return this.controlPanelService.createAdoWorkItem(adoWorkItemRequest);
  }

  @PostMapping(value = "/controlPanel/addWorkItemComment/{workItemId}")
  @RequiresAccess
  public ResponseEntity<?> addWorkItemComment(@PathVariable(name = "workItemId") Integer workItemId, @RequestBody WorkItemCommentDetails workItemCommentDetails) {
    return this.controlPanelService.addWorkItemComment(workItemId, workItemCommentDetails);
  }

  @DeleteMapping(value = "/controlPanel/deleteWorkItem/{workItemId}")
  @RequiresAccess
  public ResponseEntity<?> addWorkItemComment(@PathVariable(name = "workItemId") Integer workItemId) {
    return this.controlPanelService.deleteWorkItem(workItemId);
  }
}
