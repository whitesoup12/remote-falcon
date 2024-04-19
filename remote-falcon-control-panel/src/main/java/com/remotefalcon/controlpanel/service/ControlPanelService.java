package com.remotefalcon.controlpanel.service;

import com.remotefalcon.controlpanel.dto.TokenDTO;
import com.remotefalcon.controlpanel.entity.*;
import com.remotefalcon.controlpanel.repository.*;
import com.remotefalcon.controlpanel.repository.mongo.ShowRepository;
import com.remotefalcon.controlpanel.request.CustomLocationRequest;
import com.remotefalcon.controlpanel.request.SequenceKeyRequest;
import com.remotefalcon.controlpanel.request.ViewerPagePublicRequest;
import com.remotefalcon.controlpanel.response.GitHubIssueResponse;
import com.remotefalcon.controlpanel.response.PublicViewerPagesResponse;
import com.remotefalcon.controlpanel.util.AuthUtil;
import com.remotefalcon.controlpanel.util.EmailUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ControlPanelService {
  private final RemoteRepository remoteRepository;
  private final RemotePreferenceRepository remotePreferenceRepository;
  private final PlaylistRepository playlistRepository;
  private final RemoteJukeRepository remoteJukeRepository;
  private final RemoteViewerVoteRepository remoteViewerVoteRepository;
  private final ViewerPageMetaRepository viewerPageMetaRepository;
  private final PageGalleryHeartsRepository pageGalleryHeartsRepository;
  private final PlaylistGroupRepository playlistGroupRepository;
  private final PsaSequenceRepository psaSequenceRepository;
  private final DefaultViewerPageRepository defaultViewerPageRepository;
  private final RemoteViewerPagesRepository remoteViewerPagesRepository;
  private final RemoteViewerPageTemplatesRepository remoteViewerPageTemplatesRepository;
  private final AuthUtil authUtil;
  private final EmailUtil emailUtil;
  private final EasterEggRepository easterEggRepository;
  private final NotificationsRepository notificationsRepository;
  private final WebClient gitHubWebClient;

  private final ShowRepository showRepository;
  private final HttpServletRequest httpServletRequest;


  public ResponseEntity<RemotePreference> remotePrefs() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(tokenDTO.getShowToken());
    List<PsaSequenceOld> psaSequenceOldList = this.psaSequenceRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    List<RemoteViewerPages> remoteViewerPages = this.remoteViewerPagesRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    if(remotePreference != null) {
      remotePreference.setPsaSequenceOldList(psaSequenceOldList);
      List<String> viewerPages = remoteViewerPages.stream().map(RemoteViewerPages::getViewerPageName).toList();
      Optional<RemoteViewerPages> activeViewerPage = remoteViewerPages.stream().filter(RemoteViewerPages::getViewerPageActive).findFirst();
      remotePreference.setRemoteViewerPages(viewerPages);
      activeViewerPage.ifPresent(pages -> remotePreference.setActiveRemoteViewerPage(pages.getViewerPageName()));
      return ResponseEntity.status(200).body(remotePreference);
    }
    return ResponseEntity.status(400).build();
  }

  public ResponseEntity<List<Playlist>> sequences() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenOrderBySequenceOrderAsc(tokenDTO.getShowToken());
    return ResponseEntity.status(200).body(playlists);
  }

  public ResponseEntity<List<Playlist>> inactiveSequences() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceKeyAsc(tokenDTO.getShowToken(), false);
    return ResponseEntity.status(200).body(playlists);
  }

  public ResponseEntity<Integer> currentQueueDepth() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<RemoteJuke> remoteJukeList = this.remoteJukeRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    return ResponseEntity.status(200).body(remoteJukeList.size());
  }

  public ResponseEntity<?> customLocation(CustomLocationRequest request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(tokenDTO.getShowToken());
    if(remotePreference != null) {
      remotePreference.setRemoteLatitude(request.getRemoteLatitude());
      remotePreference.setRemoteLongitude(request.getRemoteLongitude());
      remotePreference.setEnableGeolocation(true);
      remotePreference.setEnableLocationCode(false);
      this.remotePreferenceRepository.save(remotePreference);
      return ResponseEntity.status(200).build();
    }
    return ResponseEntity.status(400).build();
  }

  public ResponseEntity<?> saveRemotePrefs(RemotePreference request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(tokenDTO.getShowToken());
    if(remotePreference != null) {
      if(request.getViewerControlEnabled() != remotePreference.getViewerControlEnabled()
              || request.getManagePsa() != remotePreference.getManagePsa()) {
        request.setSequencesPlayed(0);
      }
      request.setRemoteToken(tokenDTO.getShowToken());
      request.setRemotePrefToken(remotePreference.getRemotePrefToken());
      this.remotePreferenceRepository.save(request);

      this.psaSequenceRepository.deleteAllByRemoteToken(tokenDTO.getShowToken());

      for(PsaSequenceOld psaSequenceOld : request.getPsaSequenceOldList()) {
        psaSequenceOld.setRemoteToken(tokenDTO.getShowToken());
        psaSequenceOld.setPsaSequenceLastPlayed(ZonedDateTime.now());
      }
      this.psaSequenceRepository.saveAll(request.getPsaSequenceOldList());

      List<RemoteViewerPages> remoteViewerPages = this.remoteViewerPagesRepository.findAllByRemoteToken(tokenDTO.getShowToken());
      remoteViewerPages.forEach(viewerPage -> {
        viewerPage.setViewerPageActive(false);
        if(StringUtils.equalsIgnoreCase(request.getActiveRemoteViewerPage(), viewerPage.getViewerPageName())) {
          viewerPage.setViewerPageActive(true);
        }
      });
      this.remoteViewerPagesRepository.saveAll(remoteViewerPages.stream().toList());

      return ResponseEntity.status(200).build();
    }
    return ResponseEntity.status(400).build();
  }

  public ResponseEntity<List<RemoteJuke>> allJukeboxRequests() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<RemoteJuke> remoteJukeList = this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(tokenDTO.getShowToken());
    List<RemoteJuke> allJukeRequests = new ArrayList<>();
    remoteJukeList.forEach(juke -> {
      Optional<Playlist> playlist = this.playlistRepository.findFirstByRemoteTokenAndSequenceName(tokenDTO.getShowToken(), juke.getNextPlaylist());
      playlist.ifPresent(value -> juke.setSequence(value.getSequenceDisplayName()));
      allJukeRequests.add(juke);
    });
    return ResponseEntity.status(200).body(allJukeRequests);
  }

  public ResponseEntity<?> purgeQueue() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    this.remoteJukeRepository.deleteByRemoteToken(tokenDTO.getShowToken());

    List<Playlist> playlists = this.playlistRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    playlists.forEach(playlist -> {
      playlist.setSequenceVisibleCount(0);
      playlist.setSequenceVotes(0);
    });
    this.playlistRepository.saveAll(playlists);

    List<PlaylistGroup> playlistGroups = this.playlistGroupRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    playlistGroups.forEach(playlistGroup -> {
      playlistGroup.setSequenceGroupVisibleCount(0);
      playlistGroup.setSequenceGroupVotes(0);
    });
    this.playlistGroupRepository.saveAll(playlistGroups);

    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(tokenDTO.getShowToken());
    remotePreference.setSequencesPlayed(0);
    this.remotePreferenceRepository.save(remotePreference);

    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> deleteJukeboxRequest(Long remoteJukeKey) {
    Optional<RemoteJuke> requestToDelete = this.remoteJukeRepository.findByRemoteJukeKey(remoteJukeKey);
    requestToDelete.ifPresent(this.remoteJukeRepository::delete);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> resetAllVotes() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceOrderAsc(tokenDTO.getShowToken(), true);
    playlists.forEach(playlist -> {
      playlist.setSequenceVotes(0);
      playlist.setOwnerVoted(false);
      playlist.setSequenceVisibleCount(0);
      playlist.setSequenceVotes(0);
    });
    this.playlistRepository.saveAll(playlists.stream().toList());
    List<PlaylistGroup> playlistGroups = this.playlistGroupRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    playlistGroups.forEach(playlistGroup -> {
      playlistGroup.setSequenceGroupVotes(0);
      playlistGroup.setSequenceGroupVisibleCount(0);
      playlistGroup.setSequenceGroupVotes(0);
    });
    this.playlistGroupRepository.saveAll(playlistGroups.stream().toList());
    List<RemoteViewerVote> remoteViewerVotes = this.remoteViewerVoteRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    this.remoteViewerVoteRepository.deleteAll(remoteViewerVotes.stream().toList());

    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(tokenDTO.getShowToken());
    remotePreference.setSequencesPlayed(0);
    this.remotePreferenceRepository.save(remotePreference);

    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<ViewerPageMeta> getViewerPageMeta() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    ViewerPageMeta viewerPageMeta = this.viewerPageMetaRepository.findByRemoteToken(tokenDTO.getShowToken());
    return ResponseEntity.status(200).body(viewerPageMeta);
  }

  public ResponseEntity<ViewerPageMeta> saveViewerPageMeta(ViewerPageMeta request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    ViewerPageMeta viewerPageMeta = this.viewerPageMetaRepository.findByRemoteToken(tokenDTO.getShowToken());
    if(viewerPageMeta == null) {
      viewerPageMeta = ViewerPageMeta.builder()
              .remoteToken(tokenDTO.getShowToken())
              .build();
    }
    viewerPageMeta.setViewerPageTitle(request.getViewerPageTitle());
    viewerPageMeta.setViewerPageIconLink(request.getViewerPageIconLink());
    this.viewerPageMetaRepository.save(viewerPageMeta);
    return ResponseEntity.status(200).body(viewerPageMeta);
  }

  public ResponseEntity<Boolean> checkViewerPageModified() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    DefaultViewerPage defaultViewerPage = this.defaultViewerPageRepository.findFirstByIsVersionActive(true);
    Remote remote = this.remoteRepository.findByRemoteToken(tokenDTO.getShowToken());
    boolean isViewerPageModified = !StringUtils.equalsIgnoreCase(defaultViewerPage.getHtmlContent(), remote.getHtmlContent());
    return ResponseEntity.status(200).body(isViewerPageModified);
  }

  public ResponseEntity<?> updateViewerPagePublic(@RequestBody ViewerPagePublicRequest request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(tokenDTO.getShowToken());
    remotePreference.setViewerPagePublic(request.getViewerPagePublic());
    this.remotePreferenceRepository.save(remotePreference);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<String> getDefaultViewerPageContent() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    DefaultViewerPage defaultViewerPage = this.defaultViewerPageRepository.findFirstByIsVersionActive(true);
    return ResponseEntity.status(200).body(defaultViewerPage.getHtmlContent());
  }

  public ResponseEntity<String> getViewerPageContent() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Remote remote = this.remoteRepository.findByRemoteToken(tokenDTO.getShowToken());
    return ResponseEntity.status(200).body(remote.getHtmlContent());
  }

  public ResponseEntity<?> saveViewerPageContent(Remote request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Remote remote = this.remoteRepository.findByRemoteToken(tokenDTO.getShowToken());
    remote.setHtmlContent(request.getHtmlContent());
    this.remoteRepository.save(remote);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> saveRemoteViewerPage(RemoteViewerPages request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    this.remoteViewerPagesRepository.save(request);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> toggleSequenceVisibility(SequenceKeyRequest request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Playlist playlist = this.playlistRepository.findByRemoteTokenAndSequenceKey(tokenDTO.getShowToken(), request.getSequenceKey());
    playlist.setSequenceVisible(!playlist.getSequenceVisible());
    this.playlistRepository.save(playlist);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> deleteSequence(Long sequenceKey) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Playlist playlist = this.playlistRepository.findByRemoteTokenAndSequenceKey(tokenDTO.getShowToken(), sequenceKey);
    if(playlist != null) {
      this.playlistRepository.delete(playlist);
    }
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> deleteInactiveSequences() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceKeyAsc(tokenDTO.getShowToken(), false);
    this.playlistRepository.deleteAll(playlists);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> deleteAllSequences() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    this.playlistRepository.deleteAll(playlists);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> playSequence(@RequestBody SequenceKeyRequest request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(tokenDTO.getShowToken());
    Playlist playlist = this.playlistRepository.findByRemoteTokenAndSequenceKey(tokenDTO.getShowToken(), request.getSequenceKey());
    if(StringUtils.equalsIgnoreCase("JUKEBOX", remotePreference.getViewerControlMode())) {
      boolean ownerAlreadyRequested = !this.remoteJukeRepository.findAllByRemoteTokenAndOwnerRequested(tokenDTO.getShowToken(), true).isEmpty();
      if(ownerAlreadyRequested) {
        return ResponseEntity.status(204).build();
      }
      this.remoteJukeRepository.save(RemoteJuke.builder()
        .remoteToken(tokenDTO.getShowToken())
        .nextPlaylist(playlist.getSequenceName())
        .futurePlaylistSequence(0)
        .ownerRequested(false)
        .build());
    }else {
      boolean ownerAlreadyVoted = !this.playlistRepository.findAllByRemoteTokenAndOwnerVoted(tokenDTO.getShowToken(), true).isEmpty();
      if(ownerAlreadyVoted) {
        return ResponseEntity.status(204).build();
      }
      playlist.setOwnerVoted(true);
      playlist.setSequenceVotes(99999);
      this.playlistRepository.save(playlist);
    }
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> updateSequenceOrder(List<Playlist> request) {
    this.playlistRepository.saveAll(request.stream().toList());
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> updateSequenceDetails(List<Playlist> request) {
     TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    this.playlistRepository.saveAll(request.stream().toList());
    List<PlaylistGroup> playlistGroups = this.playlistGroupRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    playlistGroups.forEach(playlistGroup -> {
      int playlistsInGroup = 0;
      for(Playlist playlist : request) {
        if(StringUtils.equalsIgnoreCase(playlistGroup.getSequenceGroupName(), playlist.getSequenceGroup())) {
          playlistsInGroup++;
        }
      }
      playlistGroup.setSequencesInGroup(playlistsInGroup);
      if(playlistsInGroup > 0) {
        this.playlistGroupRepository.save(playlistGroup);
      }
    });
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<Integer> publicViewerPagesCount() {
    Integer publicViewerPages = this.remotePreferenceRepository.countByViewerPagePublicTrue();
    publicViewerPages = (int) Math.ceil(publicViewerPages / 8.0);
    return ResponseEntity.status(200).body(publicViewerPages);
  }

  public ResponseEntity<List<PublicViewerPagesResponse>> publicViewerPages(Integer page) {
    int pageOffset = page * 8;
    List<Remote> publicViewerPages = this.remoteRepository.findAllByViewerPagePublic(pageOffset);
    List<PublicViewerPagesResponse> publicViewerPagesResponseList = new ArrayList<>();
    publicViewerPages.forEach(remote -> {
      publicViewerPagesResponseList.add(PublicViewerPagesResponse.builder()
              .showName(remote.getRemoteName())
              .subdomain(remote.getRemoteSubdomain())
              .viewerPageContents(remote.getHtmlContent())
              .build());
    });
    return ResponseEntity.status(200).body(publicViewerPagesResponseList);
  }

  public ResponseEntity<List<PageGalleryHearts>> viewerPagesHearted() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<PageGalleryHearts> pageGalleryHearts = this.pageGalleryHeartsRepository.findAllByRemoteTokenAndViewerPageHeartedTrue(tokenDTO.getShowToken());
    return ResponseEntity.status(200).body(pageGalleryHearts);
  }

  public ResponseEntity<List<PageGalleryHearts>> viewerPageHeartCounts() {
    List<PageGalleryHearts> pageGalleryHearts = this.pageGalleryHeartsRepository.findAllByViewerPageHeartedTrue();
    Map<String, List<PageGalleryHearts>> pageGalleryHeartsBySubdomain = pageGalleryHearts.stream().collect(Collectors.groupingBy(PageGalleryHearts::getViewerPage));
    List<PageGalleryHearts> pageGalleryHeartCounts = new ArrayList<>();
    pageGalleryHeartsBySubdomain.forEach((key, value) -> pageGalleryHeartCounts.add(PageGalleryHearts.builder()
            .viewerPage(key)
            .viewerPageHeartCount(value.size())
            .build()));
    return ResponseEntity.status(200).body(pageGalleryHeartCounts);
  }

  public ResponseEntity<?> toggleViewerPageHeart(@RequestBody PageGalleryHearts request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    PageGalleryHearts pageGalleryHeart = this.pageGalleryHeartsRepository.findByRemoteTokenAndViewerPage(tokenDTO.getShowToken(), request.getViewerPage());
    if(pageGalleryHeart == null) {
      pageGalleryHeart = PageGalleryHearts.builder()
              .remoteToken(tokenDTO.getShowToken())
              .viewerPage(request.getViewerPage())
              .viewerPageHearted(true)
              .build();
    }else {
      pageGalleryHeart.setViewerPageHearted(!pageGalleryHeart.getViewerPageHearted());
    }
    this.pageGalleryHeartsRepository.save(pageGalleryHeart);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<String> getViewerPageBySubdomain(String remoteSubdomain) {
    Remote remote = this.remoteRepository.findByRemoteSubdomain(remoteSubdomain);
    if(remote != null) {
      return ResponseEntity.status(200).body(remote.getHtmlContent());
    }
    return ResponseEntity.status(404).build();
  }

  public ResponseEntity<List<PlaylistGroup>> getSequenceGroups() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<PlaylistGroup> playlistGroups = this.playlistGroupRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    playlistGroups.forEach(group -> {
      List<Playlist> playlistsInGroup = this.playlistRepository.findAllByRemoteTokenAndSequenceGroupOrderBySequenceOrderAsc(tokenDTO.getShowToken(), group.getSequenceGroupName());
      group.setSequenceNamesInGroup(playlistsInGroup.stream().map(Playlist::getSequenceName).toList());
    });
    return ResponseEntity.status(200).body(playlistGroups);
  }

  public ResponseEntity<?> saveSequenceGroup(PlaylistGroup request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    request.setRemoteToken(tokenDTO.getShowToken());
    request.setSequenceGroupVoteTime(ZonedDateTime.now());
    request.setSequenceGroupVotes(0);
    request.setSequenceGroupVotesTotal(0);
    request.setSequenceGroupVisibleCount(0);
    this.playlistGroupRepository.save(request);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> deleteSequenceGroup(Long sequenceGroupKey) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Optional<PlaylistGroup> playlistGroup = this.playlistGroupRepository.findBySequenceGroupKey(sequenceGroupKey);
    if(playlistGroup.isPresent()) {
      List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenAndSequenceGroupOrderBySequenceOrderAsc(tokenDTO.getShowToken(), playlistGroup.get().getSequenceGroupName());
      List<Playlist> playlistsToUpdate = new ArrayList<>();
      playlists.forEach(playlist -> {
        playlist.setSequenceGroup(null);
        playlistsToUpdate.add(playlist);
      });
      this.playlistRepository.saveAll(playlistsToUpdate.stream().toList());
      this.playlistGroupRepository.delete(playlistGroup.get());
    }
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<List<RemoteViewerPages>> getRemoteViewerPages() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<RemoteViewerPages> remoteViewerPages = this.remoteViewerPagesRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    return ResponseEntity.ok(remoteViewerPages);
  }

  public ResponseEntity<RemoteViewerPages> addRemoteViewerPage(RemoteViewerPages request) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Optional<RemoteViewerPages> remoteViewerPages = this.remoteViewerPagesRepository.findFirstByRemoteTokenAndViewerPageName(tokenDTO.getShowToken(), request.getViewerPageName());
    if(remoteViewerPages.isPresent()) {
      return ResponseEntity.status(204).build();
    }
    List<RemoteViewerPages> allRemoteViewerPages = this.remoteViewerPagesRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    allRemoteViewerPages.forEach(viewerPage -> viewerPage.setViewerPageActive(false));
    this.remoteViewerPagesRepository.saveAll(allRemoteViewerPages);
    request.setRemoteToken(tokenDTO.getShowToken());
    request.setViewerPageActive(true);
    this.remoteViewerPagesRepository.save(request);
    return ResponseEntity.ok(request);
  }

  public ResponseEntity<?> deleteRemoteViewerPage(Long remoteViewerPageKey) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Optional<RemoteViewerPages> remoteViewerPage = this.remoteViewerPagesRepository.findByRemoteTokenAndRemoteViewerPageKey(tokenDTO.getShowToken(), remoteViewerPageKey);
    remoteViewerPage.ifPresent(this.remoteViewerPagesRepository::delete);
    List<RemoteViewerPages> remoteViewerPages = this.remoteViewerPagesRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    if(CollectionUtils.isNotEmpty(remoteViewerPages)) {
      remoteViewerPages.get(0).setViewerPageActive(true);
      this.remoteViewerPagesRepository.save(remoteViewerPages.get(0));
    }
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<List<RemoteViewerPageTemplates>> getRemoteViewerPageTemplates() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<RemoteViewerPageTemplates> remoteViewerPageTemplates = this.remoteViewerPageTemplatesRepository.findAllByIsActive(true);
    return ResponseEntity.ok(remoteViewerPageTemplates);
  }

  public ResponseEntity<?> easterEggFound() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Optional<EasterEgg> easterEggOptional = this.easterEggRepository.findByRemoteToken(tokenDTO.getShowToken());
    if(easterEggOptional.isEmpty()) {
      this.easterEggRepository.save(EasterEgg.builder().remoteToken(tokenDTO.getShowToken()).build());
    }
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> createNotificationAllUsers(Notifications notification) {
    List<Remote> remotes = this.remoteRepository.findAll();
    List<Notifications> notifications = new ArrayList<>();
    for(Remote remote : remotes) {
      notifications.add(Notifications.builder()
                      .remoteToken(remote.getRemoteToken())
                      .notificationTitle(notification.getNotificationTitle())
                      .notificationPreview(notification.getNotificationPreview())
                      .notificationText(notification.getNotificationText())
                      .notificationRead(false)
              .build());
    }
    this.notificationsRepository.saveAll(notifications);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> createNotificationSingleUser(Notifications notification, String remoteToken) {
    this.notificationsRepository.save(Notifications.builder()
            .remoteToken(remoteToken)
            .notificationTitle(notification.getNotificationTitle())
            .notificationPreview(notification.getNotificationPreview())
            .notificationText(notification.getNotificationText())
            .notificationRead(false)
            .build());
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<List<Notifications>> getNotifications() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<Notifications> notifications = this.notificationsRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    Collections.reverse(notifications);
    return ResponseEntity.ok(notifications);
  }

  public ResponseEntity<?> markNotificationAsRead(Long notificationKey) {
    Optional<Notifications> notification = this.notificationsRepository.findByNotificationKey(notificationKey);
    if(notification.isPresent()) {
      notification.get().setNotificationRead(true);
      this.notificationsRepository.save(notification.get());
    }
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> markAllNotificationsAsRead() {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    List<Notifications> notifications = this.notificationsRepository.findAllByRemoteToken(tokenDTO.getShowToken());
    notifications.forEach(notification -> {
      notification.setNotificationRead(true);
    });
    this.notificationsRepository.saveAll(notifications);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<?> deleteNotification(Long notificationKey) {
    Optional<Notifications> notification = this.notificationsRepository.findByNotificationKey(notificationKey);
    notification.ifPresent(this.notificationsRepository::delete);
    return ResponseEntity.status(200).build();
  }

  public ResponseEntity<List<GitHubIssueResponse>> gitHubIssues() {
    List<GitHubIssueResponse> ghIssue = this.gitHubWebClient.get()
            .uri("repos/whitesoup12/remote-falcon/issues")
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<List<GitHubIssueResponse>>() {})
            .block();
    if(CollectionUtils.isNotEmpty(ghIssue)) {
      ghIssue.forEach(issue -> {
        boolean isBug = issue.getLabels().stream().anyMatch(label -> StringUtils.equalsIgnoreCase("bug", label.getName()));
        issue.setType(isBug ? "bug" : "enhancement");
      });
    }
    return ResponseEntity.ok(ghIssue);
  }

  public ResponseEntity<?> updateEmail(HttpServletRequest httpServletRequest) {
    TokenDTO tokenDTO = this.authUtil.getJwtPayload();
    Remote remote = this.remoteRepository.findByRemoteToken(tokenDTO.getShowToken());
    if(remote == null) {
      return ResponseEntity.status(401).build();
    }
    String updatedEmail = this.authUtil.getEmailFromHeader(httpServletRequest);
    if (updatedEmail != null) {
      Remote updatedEmailRemote = this.remoteRepository.findByEmail(updatedEmail);
      if(updatedEmailRemote != null) {
        return ResponseEntity.status(204).build();
      }
      remote.setEmail(updatedEmail);
      remote.setEmailVerified(false);
      this.remoteRepository.save(remote);
      //this.emailUtil.sendEmail(null, null,null, EmailTemplate.VERIFICATION);
      return ResponseEntity.status(200).build();
    }
    return ResponseEntity.status(400).build();
  }
}
