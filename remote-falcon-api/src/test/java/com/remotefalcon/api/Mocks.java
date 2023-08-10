package com.remotefalcon.api;

import com.remotefalcon.api.dto.TokenDTO;
import com.remotefalcon.api.dto.ViewerTokenDTO;
import com.remotefalcon.api.entity.*;
import com.remotefalcon.api.model.SyncPlaylistDetails;
import com.remotefalcon.api.request.*;
import com.remotefalcon.api.response.RemoteResponse;
import com.remotefalcon.api.response.api.PreferencesResponse;

import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class Mocks {
  public static Remote remote() {
    return Remote.builder()
            .remoteToken("abc123")
            .activeTheme("dark")
            .createdDate(ZonedDateTime.now().minus(30, ChronoUnit.DAYS))
            .email("email@gmail.com")
            .emailVerified(true)
            .expireDate(ZonedDateTime.now().plus(1, ChronoUnit.YEARS))
            .fppVersion("5.0.0")
            .htmlContent("customHtmlContent")
            .lastLoginDate(ZonedDateTime.now())
            .lastLoginIp("127.0.0.1")
            .password("password")
            .remoteKey((long) 1)
            .remoteName("Awesome Show")
            .pluginVersion("6.1.0")
            .remoteSubdomain("awesomeshow")
            .build();
  }

  public static DefaultViewerPage defaultViewerPage() {
    return DefaultViewerPage.builder()
            .defaultViewerPageKey((long) 1)
            .htmlContent("htmlContent")
            .isVersionActive(true)
            .versionCreateDate(ZonedDateTime.now().minus(5, ChronoUnit.DAYS))
            .version((float) 1.0)
            .build();
  }

  public static RemoteResponse remoteResponse() {
    return RemoteResponse.builder()
            .activeTheme("dark")
            .email("email@gmail.com")
            .emailVerified(false)
            .remoteKey((long) 1)
            .remoteName("Awesome Show")
            .remoteSubdomain("awesomeshow")
            .remoteToken("abc123")
            .build();
  }

  public static PasswordReset passwordReset() {
    return PasswordReset.builder()
            .email("email@gmail.com")
            .passwordResetExpiry(ZonedDateTime.now().plus(1, ChronoUnit.DAYS))
            .passwordResetLink("resetLink")
            .passwordResetToken((long) 1)
            .remoteToken("abc123")
            .build();
  }

  public static TokenDTO tokenDTO() {
    return TokenDTO.builder()
            .remoteToken("abc123")
            .email("email@gmail.com")
            .remoteSubdomain("awesomeshow")
            .build();
  }

  public static DashboardRequest dashboardRequest() {
    return DashboardRequest.builder()
            .timezone("America/Chicago")
            .startDate(ZonedDateTime.now().minus(3, ChronoUnit.MONTHS))
            .endDate(ZonedDateTime.now())
            .build();
  }

  public static List<ViewerPageStats> viewerPageStatsList() {
    List<ViewerPageStats> viewerPageStats = new ArrayList<>();
    viewerPageStats.add(ViewerPageStats.builder()
            .pageVisitDateTime(ZonedDateTime.now().minus(2, ChronoUnit.DAYS))
            .viewerPageStatKey((long) 1)
            .remoteToken("abc123")
            .pageVisitIp("127.0.0.1")
            .build());
    viewerPageStats.add(ViewerPageStats.builder()
            .pageVisitDateTime(ZonedDateTime.now().minus(2, ChronoUnit.DAYS))
            .viewerPageStatKey((long) 2)
            .remoteToken("abc123")
            .pageVisitIp("127.0.0.2")
            .build());
    viewerPageStats.add(ViewerPageStats.builder()
            .pageVisitDateTime(ZonedDateTime.now().minus(1, ChronoUnit.DAYS))
            .viewerPageStatKey((long) 3)
            .remoteToken("abc123")
            .pageVisitIp("127.0.0.1")
            .build());
    return viewerPageStats;
  }

  public static List<ViewerJukeStats> viewerJukeStats() {
    List<ViewerJukeStats> viewerJukeStats = new ArrayList<>();
    viewerJukeStats.add(ViewerJukeStats.builder()
            .requestDateTime(ZonedDateTime.now().minus(2, ChronoUnit.DAYS))
            .viewerJukeStatKey((long) 1)
            .remoteToken("abc123")
            .playlistName("Sequence One")
            .build());
    viewerJukeStats.add(ViewerJukeStats.builder()
            .requestDateTime(ZonedDateTime.now().minus(2, ChronoUnit.DAYS))
            .viewerJukeStatKey((long) 2)
            .remoteToken("abc123")
            .playlistName("Sequence Two")
            .build());
    viewerJukeStats.add(ViewerJukeStats.builder()
            .requestDateTime(ZonedDateTime.now().minus(1, ChronoUnit.DAYS))
            .viewerJukeStatKey((long) 3)
            .remoteToken("abc123")
            .playlistName("Sequence One")
            .build());
    return viewerJukeStats;
  }

  public static List<ViewerVoteStats> viewerVoteStats() {
    List<ViewerVoteStats> viewerVoteStats = new ArrayList<>();
    viewerVoteStats.add(ViewerVoteStats.builder()
            .viewerVoteStatKey((long) 1)
            .remoteToken("abc123")
            .playlistName("Sequence One")
            .voteDateTime(ZonedDateTime.now().minus(2, ChronoUnit.DAYS))
            .build());
    viewerVoteStats.add(ViewerVoteStats.builder()
            .viewerVoteStatKey((long) 2)
            .remoteToken("abc123")
            .playlistName("Sequence Two")
            .voteDateTime(ZonedDateTime.now().minus(2, ChronoUnit.DAYS))
            .build());
    viewerVoteStats.add(ViewerVoteStats.builder()
            .viewerVoteStatKey((long) 3)
            .remoteToken("abc123")
            .playlistName("Sequence One")
            .voteDateTime(ZonedDateTime.now().minus(1, ChronoUnit.DAYS))
            .build());
    return viewerVoteStats;
  }

  public static List<ViewerVoteWinStats> viewerVoteWinStats() {
    List<ViewerVoteWinStats> viewerVoteWinStats = new ArrayList<>();
    viewerVoteWinStats.add(ViewerVoteWinStats.builder()
            .viewerVoteWinStatKey((long) 1)
            .remoteToken("abc123")
            .playlistName("Sequence One")
            .voteWinDateTime(ZonedDateTime.now().minus(2, ChronoUnit.DAYS))
            .build());
    viewerVoteWinStats.add(ViewerVoteWinStats.builder()
            .viewerVoteWinStatKey((long) 2)
            .remoteToken("abc123")
            .playlistName("Sequence Two")
            .voteWinDateTime(ZonedDateTime.now().minus(2, ChronoUnit.DAYS))
            .build());
    viewerVoteWinStats.add(ViewerVoteWinStats.builder()
            .viewerVoteWinStatKey((long) 3)
            .remoteToken("abc123")
            .playlistName("Sequence One")
            .voteWinDateTime(ZonedDateTime.now().minus(1, ChronoUnit.DAYS))
            .build());
    return viewerVoteWinStats;
  }

  public static List<ActiveViewer> activeViewers() {
    List<ActiveViewer> activeViewers = new ArrayList<>();
    activeViewers.add(ActiveViewer.builder()
            .lastUpdateDateTime(ZonedDateTime.now())
            .viewerIp("127.0.0.1")
            .remoteToken("abc123")
            .activeViewerKey((long) 1)
            .build());
    activeViewers.add(ActiveViewer.builder()
            .lastUpdateDateTime(ZonedDateTime.now().minus(1, ChronoUnit.HOURS))
            .viewerIp("127.0.0.2")
            .remoteToken("abc123")
            .activeViewerKey((long) 2)
            .build());
    return activeViewers;
  }

  public static ActiveViewer activeViewer() {
    return ActiveViewer.builder()
            .lastUpdateDateTime(ZonedDateTime.now())
            .viewerIp("127.0.0.2")
            .remoteToken("abc123")
            .activeViewerKey((long) 1)
            .build();
  }

  public static UpdateShowName updateShowName() {
    return UpdateShowName.builder()
            .remoteName("New Awesome Show")
            .remoteSubdomain("newawesomeshow")
            .build();
  }

  public static ExternalApiAccess externalApiAccess() {
    return ExternalApiAccess.builder()
            .createdDate(ZonedDateTime.now())
            .isActive(true)
            .accessSecret("secret")
            .accessToken("token")
            .remoteToken("abc123")
            .externalApiAccessKey((long) 1)
            .build();
  }

  public static RemotePreference remotePreference() {
    return RemotePreference.builder()
            .checkIfVoted(false)
            .psaEnabled(false)
            .psaSequence(null)
            .allowedRadius((float) 0.5)
            .apiAccessRequested(false)
            .autoSwitchControlModeSize(0)
            .autoSwitchControlModeToggled(false)
            .enableLocationCode(false)
            .hideSequenceCount(0)
            .enableGeolocation(false)
            .jukeboxDepth(5)
            .interruptSchedule(false)
            .remoteLatitude((float) 32.0)
            .jukeboxHistoryLimit(0)
            .jukeboxRequestLimit(0)
            .remoteLongitude((float) -96.0)
            .remoteToken("abc123")
            .messageDisplayTime(6)
            .resetVotes(false)
            .viewerControlEnabled(true)
            .viewerControlMode("jukebox")
            .viewerModeEnabled(true)
            .locationCode(null)
            .psaFrequency(0)
            .viewerPagePublic(true)
            .build();
  }

  public static List<PsaSequence> psaSequenceList() {
    List<PsaSequence> psaSequenceList = new ArrayList<>();
    psaSequenceList.add(PsaSequence.builder()
            .psaSequenceKey((long) 1)
            .psaSequenceLastPlayed(ZonedDateTime.now())
            .psaSequenceName("Sequence 1")
            .psaSequenceOrder(1)
            .remoteToken("abc123")
            .build());
    psaSequenceList.add(PsaSequence.builder()
            .psaSequenceKey((long) 2)
            .psaSequenceLastPlayed(ZonedDateTime.now())
            .psaSequenceName("Sequence 2")
            .psaSequenceOrder(2)
            .remoteToken("abc123")
            .build());
    return psaSequenceList;
  }

  public static List<Playlist> sequences() {
    List<Playlist> playlists = new ArrayList<>();
    playlists.add(Playlist.builder()
            .sequenceKey((long) 1)
            .sequenceDisplayName("Sequence One")
            .isSequenceActive(true)
            .sequenceIndex(1)
            .sequenceVisible(true)
            .sequenceOrder(1)
            .remoteToken("abc123")
            .sequenceName("Sequence One")
            .sequenceVotes(0)
            .sequenceVoteTime(ZonedDateTime.now().minus(1, ChronoUnit.HOURS))
            .sequenceVisibleCount(0)
            .sequenceGroup(null)
            .build());
    playlists.add(Playlist.builder()
            .sequenceKey((long) 2)
            .sequenceDisplayName("Sequence Two")
            .isSequenceActive(true)
            .sequenceIndex(2)
            .sequenceVisible(true)
            .sequenceOrder(2)
            .remoteToken("abc123")
            .sequenceName("Sequence Two")
            .sequenceVotes(0)
            .sequenceVoteTime(ZonedDateTime.now().minus(1, ChronoUnit.HOURS))
            .sequenceVisibleCount(0)
            .sequenceGroup(null)
            .build());
    playlists.add(Playlist.builder()
            .sequenceKey((long) 3)
            .sequenceDisplayName("Sequence Three")
            .isSequenceActive(true)
            .sequenceIndex(3)
            .sequenceVisible(true)
            .sequenceOrder(3)
            .remoteToken("abc123")
            .sequenceName("Sequence Three")
            .sequenceVotes(0)
            .sequenceVoteTime(ZonedDateTime.now().minus(1, ChronoUnit.MINUTES))
            .sequenceVisibleCount(0)
            .sequenceGroup(null)
            .build());
    return playlists;
  }

  public static List<RemoteJuke> remoteJukeList() {
    List<RemoteJuke> remoteJukes = new ArrayList<>();
    remoteJukes.add(RemoteJuke.builder()
            .remoteJukeKey((long) 1)
            .remoteToken("abc123")
            .nextPlaylist("Sequence One")
            .build());
    remoteJukes.add(RemoteJuke.builder()
            .remoteJukeKey((long) 2)
            .remoteToken("abc123")
            .futurePlaylist("Sequence Two")
            .futurePlaylistSequence(1)
            .build());
    remoteJukes.add(RemoteJuke.builder()
            .remoteJukeKey((long) 3)
            .remoteToken("abc123")
            .futurePlaylist("Sequence Three")
            .futurePlaylistSequence(3)
            .build());
    return remoteJukes;
  }

  public static CustomLocationRequest customLocationRequest() {
    return CustomLocationRequest.builder()
            .remoteLatitude((float) 36.0)
            .remoteLongitude((float) -96.0)
            .build();
  }

  public static RemoteJuke remoteJuke_next() {
    return RemoteJuke.builder()
            .remoteJukeKey((long) 1)
            .remoteToken("abc123")
            .nextPlaylist("Sequence One")
            .build();
  }

  public static RemoteJuke remoteJuke_future() {
    return RemoteJuke.builder()
            .remoteJukeKey((long) 2)
            .remoteToken("abc123")
            .futurePlaylist("Sequence Two")
            .futurePlaylistSequence(2)
            .build();
  }

  public static List<RemoteViewerVote> remoteViewerVotes() {
    List<RemoteViewerVote> remoteViewerVotes = new ArrayList<>();
    remoteViewerVotes.add(RemoteViewerVote.builder()
            .remoteViewerVoteKey((long) 1)
            .viewerIp("127.0.0.1")
            .remoteToken("abc123")
            .build());
    remoteViewerVotes.add(RemoteViewerVote.builder()
            .remoteViewerVoteKey((long) 2)
            .viewerIp("127.0.0.2")
            .remoteToken("abc123")
            .build());
    return remoteViewerVotes;
  }

  public static ViewerPageMeta viewerPageMeta() {
    return ViewerPageMeta.builder()
            .remoteToken("abc123")
            .viewerPageMetaKey((long) 1)
            .viewerPageIconLink("link")
            .viewerPageTitle("title")
            .build();
  }

  public static ViewerPagePublicRequest viewerPagePublicRequest() {
    return ViewerPagePublicRequest.builder()
            .viewerPagePublic(true)
            .build();
  }

  public static Playlist sequence() {
    return Playlist.builder()
            .sequenceKey((long) 1)
            .sequenceDisplayName("Sequence One")
            .isSequenceActive(true)
            .sequenceIndex(1)
            .sequenceVisible(true)
            .sequenceOrder(1)
            .remoteToken("abc123")
            .sequenceName("Sequence One")
            .build();
  }

  public static SequenceKeyRequest sequenceKeyRequest() {
    return SequenceKeyRequest.builder()
            .sequenceKey((long) 1)
            .build();
  }

  public static List<Remote> remotes() {
    List<Remote> remotes = new ArrayList<>();
    remotes.add(Remote.builder()
            .remoteToken("abc123")
            .activeTheme("dark")
            .createdDate(ZonedDateTime.now().minus(30, ChronoUnit.DAYS))
            .email("email@gmail.com")
            .emailVerified(true)
            .expireDate(ZonedDateTime.now().plus(1, ChronoUnit.YEARS))
            .fppVersion("5.0.0")
            .htmlContent("customHtmlContent")
            .lastLoginDate(ZonedDateTime.now())
            .lastLoginIp("127.0.0.1")
            .password("password")
            .remoteKey((long) 1)
            .remoteName("Awesome Show")
            .pluginVersion("6.1.0")
            .remoteSubdomain("awesomeshow")
            .build());
    remotes.add(Remote.builder()
            .remoteToken("def456")
            .activeTheme("dark")
            .createdDate(ZonedDateTime.now().minus(30, ChronoUnit.DAYS))
            .email("someoneElse@gmail.com")
            .emailVerified(true)
            .expireDate(ZonedDateTime.now().plus(1, ChronoUnit.YEARS))
            .fppVersion("5.0.0")
            .htmlContent("customHtmlContent")
            .lastLoginDate(ZonedDateTime.now())
            .lastLoginIp("127.0.0.2")
            .password("password")
            .remoteKey((long) 2)
            .remoteName("A Different Awesome Show")
            .pluginVersion("6.1.0")
            .remoteSubdomain("adifferentawesomeshow")
            .build());
    return remotes;
  }

  public static List<PageGalleryHearts> pageGalleryHeartsList() {
    List<PageGalleryHearts> pageGalleryHearts = new ArrayList<>();
    pageGalleryHearts.add(PageGalleryHearts.builder()
            .pageGalleryHeartsKey((long) 1)
            .viewerPage("awesomeshow")
            .remoteToken("abc123")
            .viewerPageHearted(true)
            .build());
    pageGalleryHearts.add(PageGalleryHearts.builder()
            .pageGalleryHeartsKey((long) 2)
            .viewerPage("anotherawesomeshow")
            .remoteToken("abc123")
            .viewerPageHearted(true)
            .build());
    pageGalleryHearts.add(PageGalleryHearts.builder()
            .pageGalleryHeartsKey((long) 2)
            .viewerPage("awesomeshow")
            .remoteToken("def456")
            .viewerPageHearted(true)
            .build());
    return pageGalleryHearts;
  }

  public static PageGalleryHearts pageGalleryHearts() {
    return PageGalleryHearts.builder()
            .pageGalleryHeartsKey((long) 1)
            .viewerPage("awesomeshow")
            .remoteToken("abc123")
            .viewerPageHearted(true)
            .build();
  }

  public static PreferencesResponse preferencesResponse() {
    return PreferencesResponse.builder()
            .viewerControlMode("jukebox")
            .viewerControlEnabled(true)
            .showName("Awesome Show")
            .messageDisplayTime(6)
            .jukeboxDepth(5)
            .enableLocationCode(false)
            .enableGeolocation(false)
            .locationCode(null)
            .build();
  }

  public static ViewerTokenDTO viewerTokenDTO() {
    return ViewerTokenDTO.builder()
            .subdomain("awesomeshow")
            .remoteToken("abc123")
            .build();
  }

  public static CurrentPlaylist currentPlaylist() {
    return CurrentPlaylist.builder()
            .currentPlaylist("Sequence One")
            .remoteToken("abc123")
            .currentPlaylistKey((long) 1)
            .build();
  }

  public static ViewerPageStats viewerPageStats() {
    return ViewerPageStats.builder()
            .pageVisitDateTime(ZonedDateTime.now().minus(2, ChronoUnit.DAYS))
            .viewerPageStatKey((long) 1)
            .remoteToken("abc123")
            .pageVisitIp("127.0.0.1")
            .build();
  }

  public static ViewerPageVisitRequest viewerPageVisitRequest() {
    return ViewerPageVisitRequest.builder()
            .pageVisitDate(ZonedDateTime.now())
            .build();
  }

  public static FppSchedule fppSchedule() {
    return FppSchedule.builder()
            .remoteToken("abc123")
            .nextScheduledSequence("Scheduled Sequence")
            .fppScheduleKey((long) 1)
            .build();
  }

  public static AddSequenceRequest addSequenceRequest() {
    return AddSequenceRequest.builder()
            .date(ZonedDateTime.now())
            .playlist("Sequence One")
            .timezone("America/Chicago")
            .viewerLatitude((float) 32.0)
            .viewerLongitude((float) -96.0)
            .build();
  }

  public static RemoteViewerVote remoteViewerVote() {
    return RemoteViewerVote.builder()
            .remoteViewerVoteKey((long) 1)
            .viewerIp("127.0.0.2")
            .remoteToken("abc123")
            .build();
  }

  public static SyncPlaylistRequest syncPlaylistRequest() {
    List<SyncPlaylistDetails> syncPlaylistDetails = new ArrayList<>();
    syncPlaylistDetails.add(SyncPlaylistDetails.builder()
                    .playlistDuration(30)
                    .playlistIndex(4)
                    .playlistType("SEQUENCE")
                    .playlistName("Sequence Four")
            .build());
    syncPlaylistDetails.add(SyncPlaylistDetails.builder()
            .playlistDuration(30)
            .playlistIndex(5)
            .playlistType("SEQUENCE")
            .playlistName("Sequence Five")
            .build());
    return SyncPlaylistRequest.builder()
            .playlists(syncPlaylistDetails)
            .build();
  }

  public static UpdateWhatsPlayingRequest updateWhatsPlayingRequest() {
    return UpdateWhatsPlayingRequest.builder()
            .playlist("Sequence One")
            .build();
  }

  public static UpdateNextScheduledRequest updateNextScheduledRequest() {
    return UpdateNextScheduledRequest.builder()
            .sequence("Scheduled Sequence")
            .build();
  }

  public static PluginVersion pluginVersion() {
    return PluginVersion.builder()
            .fppVersion("5.0")
            .pluginVersion("6.0")
            .build();
  }

  public static ViewerControlRequest viewerControlRequest() {
    return ViewerControlRequest.builder()
            .viewerControlEnabled("Y")
            .build();
  }

  public static List<PlaylistGroup> playlistGroupList() {
    List<PlaylistGroup> playlistGroupList = new ArrayList<>();
    playlistGroupList.add(PlaylistGroup.builder()
            .remoteToken("abc123")
            .sequenceGroupKey((long) 1)
            .sequenceGroupName("Group")
            .sequenceGroupVotes(0)
            .sequenceGroupVotesTotal(0)
            .sequenceGroupVoteTime(ZonedDateTime.now().minus(1, ChronoUnit.YEARS))
            .sequencesInGroup(2)
            .sequenceGroupVisibleCount(0)
            .build());
    return playlistGroupList;
  }

  public static List<RemoteViewerPages> remoteViewerPages() {
    List<RemoteViewerPages> remoteViewerPages = new ArrayList<>();
    remoteViewerPages.add(RemoteViewerPages.builder()
            .remoteToken("abc123")
            .viewerPageName("Christmas")
            .viewerPageActive(true)
            .viewerPageHtml("html")
            .remoteViewerPageKey((long) 1)
            .build());
    return remoteViewerPages;
  }
}
