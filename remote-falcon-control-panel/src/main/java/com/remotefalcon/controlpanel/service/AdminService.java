package com.remotefalcon.controlpanel.service;

import com.remotefalcon.controlpanel.documents.models.Preference;
import com.remotefalcon.controlpanel.documents.Show;
import com.remotefalcon.controlpanel.documents.models.*;
import com.remotefalcon.controlpanel.documents.models.PsaSequence;
import com.remotefalcon.controlpanel.entity.*;
import com.remotefalcon.controlpanel.enums.LocationCheckMethod;
import com.remotefalcon.controlpanel.enums.ShowRole;
import com.remotefalcon.controlpanel.enums.ViewerControlMode;
import com.remotefalcon.controlpanel.repository.*;
import com.remotefalcon.controlpanel.repository.mongo.ShowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {
    private final RemoteRepository remoteRepository;
    private final RemotePreferenceRepository remotePreferenceRepository;
    private final ExternalApiAccessRepository externalApiAccessRepository;
    private final PlaylistRepository playlistRepository;
    private final PlaylistGroupRepository playlistGroupRepository;
    private final PsaSequenceRepository psaSequenceRepository;
    private final RemoteViewerPagesRepository remoteViewerPagesRepository;
    private final ViewerJukeStatsRepository viewerJukeStatsRepository;
    private final ViewerPageMetaRepository viewerPageMetaRepository;
    private final ViewerPageStatsRepository viewerPageStatsRepository;
    private final ViewerVoteStatsRepository viewerVoteStatsRepository;
    private final ViewerVoteWinStatsRepository viewerVoteWinStatsRepository;
    private final ShowRepository showRepository;

    public ResponseEntity<?> migrateShowToMongo(String token) {
        Remote remote = this.remoteRepository.findByRemoteToken(token);
        return this.migrate(remote);
    }

    public ResponseEntity<?> migrateAllToMongo() {
        //Iterate all shows. Much processing
        List<Remote> remotes = this.remoteRepository.findAll();
        remotes.forEach(this::migrate);

        return ResponseEntity.status(200).build();
    }

    public ResponseEntity<?> migrate(Remote remote) {
        this.showRepository.deleteByShowToken(remote.getRemoteToken());

        CompletableFuture<RemotePreference> remotePreferenceFuture = CompletableFuture.supplyAsync(() -> this.remotePreferenceRepository.findByRemoteToken(remote.getRemoteToken()));
        CompletableFuture<ExternalApiAccess> externalApiAccessFuture = CompletableFuture.supplyAsync(() -> this.externalApiAccessRepository.findByRemoteToken(remote.getRemoteToken()));
        CompletableFuture<List<Playlist>> playlistsFuture = CompletableFuture.supplyAsync(() -> this.playlistRepository.findAllByRemoteToken(remote.getRemoteToken()));
        CompletableFuture<List<PlaylistGroup>> playlistGroupsFuture = CompletableFuture.supplyAsync(() -> this.playlistGroupRepository.findAllByRemoteToken(remote.getRemoteToken()));
        CompletableFuture<List<PsaSequenceOld>> psaSequencesFuture = CompletableFuture.supplyAsync(() -> this.psaSequenceRepository.findAllByRemoteToken(remote.getRemoteToken()));
        CompletableFuture<List<RemoteViewerPages>> remoteViewerPagesFuture = CompletableFuture.supplyAsync(() -> this.remoteViewerPagesRepository.findAllByRemoteToken(remote.getRemoteToken()));
        CompletableFuture<ViewerPageMeta> viewerPageMetaFuture = CompletableFuture.supplyAsync(() -> this.viewerPageMetaRepository.findByRemoteToken(remote.getRemoteToken()));
        CompletableFuture<List<ViewerJukeStats>> viewerJukeStatsFuture = CompletableFuture.supplyAsync(() -> this.viewerJukeStatsRepository.findAllByRemoteToken(remote.getRemoteToken()));
        CompletableFuture<List<ViewerPageStats>> viewerPageStatsFuture = CompletableFuture.supplyAsync(() -> this.viewerPageStatsRepository.findAllByRemoteToken(remote.getRemoteToken()));
        CompletableFuture<List<ViewerVoteStats>> viewerVoteStatsFuture = CompletableFuture.supplyAsync(() -> this.viewerVoteStatsRepository.findAllByRemoteToken(remote.getRemoteToken()));
        CompletableFuture<List<ViewerVoteWinStats>> viewerVoteWinStatsFuture = CompletableFuture.supplyAsync(() -> this.viewerVoteWinStatsRepository.findAllByRemoteToken(remote.getRemoteToken()));

        Show show = Show.builder()
                .showToken(remote.getRemoteToken())
                .email(remote.getEmail())
                .password(remote.getPassword())
                .showName(remote.getRemoteName())
                .showSubdomain(remote.getRemoteSubdomain())
                .emailVerified(remote.getEmailVerified())
                .createdDate(remote.getCreatedDate() != null ? remote.getCreatedDate().toLocalDateTime() : null)
                .lastLoginDate(remote.getLastLoginDate() != null ? remote.getLastLoginDate().toLocalDateTime() : null)
                .expireDate(remote.getExpireDate() != null ? remote.getExpireDate().toLocalDateTime() : null)
                .pluginVersion(remote.getPluginVersion())
                .fppVersion(remote.getFppVersion())
                .lastLoginIp(remote.getLastLoginIp())
                .showRole(ShowRole.valueOf(remote.getUserRole()))
                .userProfile(UserProfile.builder()
                        .firstName(remote.getFirstName())
                        .lastName(remote.getLastName())
                        .facebookUrl(remote.getFacebookUrl())
                        .youtubeUrl(remote.getYoutubeUrl())
                        .build())
                .build();

        try {
            RemotePreference remotePreference = remotePreferenceFuture.get();
            ExternalApiAccess externalApiAccess = externalApiAccessFuture.get();
            List<Playlist> playlists = playlistsFuture.get();
            List<PlaylistGroup> playlistGroups = playlistGroupsFuture.get();
            List<PsaSequenceOld> psaSequenceOlds = psaSequencesFuture.get();
            List<RemoteViewerPages> remoteViewerPages = remoteViewerPagesFuture.get();
            ViewerPageMeta viewerPageMeta = viewerPageMetaFuture.get();
            List<ViewerJukeStats> viewerJukeStats = viewerJukeStatsFuture.get();
            List<ViewerPageStats> viewerPageStats = viewerPageStatsFuture.get();
            List<ViewerVoteStats> viewerVoteStats = viewerVoteStatsFuture.get();
            List<ViewerVoteWinStats> viewerVoteWinStats = viewerVoteWinStatsFuture.get();

            this.setShowPreferences(show, remotePreference, viewerPageMeta);
            this.setApiAccess(show, externalApiAccess);
            this.setSequences(show, playlists);
            this.setSequenceGroups(show, playlistGroups);
            this.setPsaSequences(show, psaSequenceOlds);
            this.setPages(show, remoteViewerPages);

            Stat stat = Stat.builder()
                    .jukebox(this.setJukeStats(viewerJukeStats))
                    .page(this.setPageStats(viewerPageStats))
                    .voting(this.setVotingStats(viewerVoteStats))
                    .votingWin(this.setVotingWinStats(viewerVoteWinStats))
                    .build();

            show.setStats(stat);

        } catch (ExecutionException | InterruptedException e) {
            log.error("Error migrating: token {}", remote.getRemoteToken(), e);
            return ResponseEntity.status(400).build();
        }

        this.showRepository.save(show);

        return ResponseEntity.status(200).build();
    }

    private void setShowPreferences(Show show, RemotePreference remotePreference, ViewerPageMeta viewerPageMeta) {
        if(remotePreference != null) {
            LocationCheckMethod locationCheckMethod = LocationCheckMethod.NONE;
            if(remotePreference.getEnableGeolocation()) {
                locationCheckMethod = LocationCheckMethod.GEO;
            }else if(remotePreference.getEnableLocationCode()) {
                locationCheckMethod = LocationCheckMethod.CODE;
            }
            Integer locationCode = null;
            try {
                locationCode = Integer.parseInt(remotePreference.getLocationCode());
            }catch(Exception e) {
                //doNothing
            }
            show.setPreferences(Preference.builder()
                    .viewerControlEnabled(remotePreference.getViewerControlEnabled())
                    .viewerControlMode(ViewerControlMode.valueOf(remotePreference.getViewerControlMode().toUpperCase()))
                    .resetVotes(remotePreference.getResetVotes())
                    .jukeboxDepth(remotePreference.getJukeboxDepth())
                    .locationCheckMethod(locationCheckMethod)
                    .showLatitude(remotePreference.getRemoteLatitude())
                    .showLongitude(remotePreference.getRemoteLongitude())
                    .allowedRadius(remotePreference.getAllowedRadius())
                    .checkIfVoted(remotePreference.getCheckIfVoted())
                    .psaEnabled(remotePreference.getPsaEnabled())
                    .psaFrequency(remotePreference.getPsaFrequency())
                    .jukeboxRequestLimit(remotePreference.getJukeboxRequestLimit())
                    .jukeboxHistoryLimit(remotePreference.getJukeboxHistoryLimit())
                    .locationCode(locationCode)
                    .hideSequenceCount(remotePreference.getHideSequenceCount())
                    .makeItSnow(remotePreference.getMakeItSnow())
                    .managePsa(remotePreference.getManagePsa())
                    .sequencesPlayed(remotePreference.getSequencesPlayed())
                    .pageTitle(viewerPageMeta != null ? viewerPageMeta.getViewerPageTitle() : null)
                    .pageIconUrl(viewerPageMeta != null ? viewerPageMeta.getViewerPageIconLink() : null)
                    .build());
        }
    }

    private void setApiAccess(Show show, ExternalApiAccess externalApiAccess) {
        if(externalApiAccess != null) {
            show.setApiAccess(ApiAccess.builder()
                            .apiAccessActive(externalApiAccess.getIsActive())
                            .apiAccessToken(externalApiAccess.getAccessToken())
                            .apiAccessSecret(externalApiAccess.getAccessSecret())
                    .build());
        }else {
            show.setApiAccess(ApiAccess.builder()
                    .apiAccessActive(false)
                    .build());
        }
    }

    private void setSequences(Show show, List<Playlist> playlists) {
        List<Sequence> sequences = new ArrayList<>();
        if(playlists != null) {
            playlists.forEach(playlist -> sequences.add(Sequence.builder()
                    .name(playlist.getSequenceName())
                    .key(playlist.getSequenceKey())
                    .displayName(playlist.getSequenceDisplayName())
                    .duration(playlist.getSequenceDuration())
                    .visible(playlist.getSequenceVisible())
                    .votes(playlist.getSequenceVotes())
                    .lastVoteTime(playlist.getSequenceVoteTime() != null ? playlist.getSequenceVoteTime().toLocalDateTime() : null)
                    .totalVotes(playlist.getSequenceVotesTotal())
                    .index(playlist.getSequenceIndex())
                    .order(playlist.getSequenceOrder())
                    .imageUrl(playlist.getSequenceImageUrl())
                    .active(playlist.getIsSequenceActive())
                    .ownerVoted(playlist.getOwnerVoted())
                    .visibilityCount(playlist.getSequenceVisibleCount())
                    .type(playlist.getSequenceType())
                    .group(playlist.getSequenceGroup())
                    .category(playlist.getSequenceCategory())
                    .artist(playlist.getSequenceArtist())
                    .build()));
            show.setSequences(sequences);
        }
    }

    private void setSequenceGroups(Show show, List<PlaylistGroup> playlistGroups) {
        List<SequenceGroup> sequenceGroups = new ArrayList<>();
        if(playlistGroups != null) {
            playlistGroups.forEach(playlistGroup -> sequenceGroups.add(SequenceGroup.builder()
                    .name(playlistGroup.getSequenceGroupName())
                    .votes(playlistGroup.getSequenceGroupVotes())
                    .lastVoteTime(playlistGroup.getSequenceGroupVoteTime() != null ? playlistGroup.getSequenceGroupVoteTime().toLocalDateTime() : null)
                    .totalVotes(playlistGroup.getSequenceGroupVotesTotal())
                    .visibilityCount(playlistGroup.getSequenceGroupVisibleCount())
                    .build()));
            show.setSequenceGroups(sequenceGroups);
        }
    }

    private void setPsaSequences(Show show, List<PsaSequenceOld> psaSequenceOlds) {
        List<PsaSequence> newPsaSequences = new ArrayList<>();
        if(psaSequenceOlds != null) {
            psaSequenceOlds.forEach(psaSequence -> newPsaSequences.add(PsaSequence.builder()
                    .name(psaSequence.getPsaSequenceName())
                    .order(psaSequence.getPsaSequenceOrder())
                    .lastPlayed(psaSequence.getPsaSequenceLastPlayed() != null ? psaSequence.getPsaSequenceLastPlayed().toLocalDateTime() : null)
                    .build()));
            show.setPsaSequences(newPsaSequences);
        }
    }

    private void setPages(Show show, List<RemoteViewerPages> remoteViewerPages) {
        List<Page> pages = new ArrayList<>();
        if(remoteViewerPages != null) {
            remoteViewerPages.forEach(remoteViewerPage -> pages.add(Page.builder()
                    .name(remoteViewerPage.getViewerPageName())
                    .active(remoteViewerPage.getViewerPageActive())
                    .html(remoteViewerPage.getViewerPageHtml())
                    .build()));
            show.setPages(pages);
        }
    }

    private List<Stat.Jukebox> setJukeStats(List<ViewerJukeStats> viewerJukeStats) {
        List<Stat.Jukebox> jukeboxStats = new ArrayList<>();
        if(viewerJukeStats != null) {
            viewerJukeStats.forEach(stat -> jukeboxStats.add(Stat.Jukebox.builder()
                    .name(stat.getPlaylistName())
                    .dateTime(stat.getRequestDateTime() != null ? stat.getRequestDateTime().toLocalDateTime() : null)
                    .build()));
        }
        return jukeboxStats;
    }

    private List<Stat.Page> setPageStats(List<ViewerPageStats> viewerPageStats) {
        List<Stat.Page> pageStats = new ArrayList<>();
        if(viewerPageStats != null) {
            viewerPageStats.forEach(stat -> pageStats.add(Stat.Page.builder()
                    .ip(stat.getPageVisitIp())
                    .dateTime(stat.getPageVisitDateTime() != null ? stat.getPageVisitDateTime().toLocalDateTime() : null)
                    .build()));
        }
        return pageStats;
    }

    private List<Stat.Voting> setVotingStats(List<ViewerVoteStats> viewerVoteStats) {
        List<Stat.Voting> votingStats = new ArrayList<>();
        if(viewerVoteStats != null) {
            viewerVoteStats.forEach(voteStat -> votingStats.add(Stat.Voting.builder()
                    .name(voteStat.getPlaylistName())
                    .dateTime(voteStat.getVoteDateTime() != null ? voteStat.getVoteDateTime().toLocalDateTime() : null)
                    .build()));
        }
        return votingStats;
    }

    private List<Stat.VotingWin> setVotingWinStats(List<ViewerVoteWinStats> viewerVoteWinStats) {
        List<Stat.VotingWin> votingWinStats = new ArrayList<>();
        if(viewerVoteWinStats != null) {
            viewerVoteWinStats.forEach(voteStat -> votingWinStats.add(Stat.VotingWin.builder()
                    .name(voteStat.getPlaylistName())
                    .total(voteStat.getTotalVotes())
                    .dateTime(voteStat.getVoteWinDateTime() != null ? voteStat.getVoteWinDateTime().toLocalDateTime() : null)
                    .build()));
        }
        return votingWinStats;
    }
}
