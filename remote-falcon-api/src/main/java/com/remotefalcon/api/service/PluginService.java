package com.remotefalcon.api.service;

import com.remotefalcon.api.entity.*;
import com.remotefalcon.api.model.SyncPlaylistDetails;
import com.remotefalcon.api.repository.*;
import com.remotefalcon.api.request.*;
import com.remotefalcon.api.response.HighestVotedPlaylistResponse;
import com.remotefalcon.api.response.NextPlaylistResponse;
import com.remotefalcon.api.response.PluginResponse;
import com.remotefalcon.api.response.RemotePreferenceResponse;
import com.remotefalcon.api.util.AuthUtil;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class PluginService {
  private final RemoteRepository remoteRepository;
  private final RemoteJukeRepository remoteJukeRepository;
  private final RemotePreferenceRepository remotePreferenceRepository;
  private final PlaylistRepository playlistRepository;
  private final FppScheduleRepository fppScheduleRepository;
  private final CurrentPlaylistRepository currentPlaylistRepository;
  private final RemoteViewerVoteRepository remoteViewerVoteRepository;
  private final ViewerVoteWinStatsRepository viewerVoteWinStatsRepository;
  private final PlaylistGroupRepository playlistGroupRepository;
  private final PsaSequenceRepository psaSequenceRepository;
  private final AuthUtil authUtil;

  @Autowired
  public PluginService(RemoteRepository remoteRepository, RemoteJukeRepository remoteJukeRepository, RemotePreferenceRepository remotePreferenceRepository,
                       PlaylistRepository playlistRepository, FppScheduleRepository fppScheduleRepository,
                       CurrentPlaylistRepository currentPlaylistRepository, RemoteViewerVoteRepository remoteViewerVoteRepository,
                       ViewerVoteWinStatsRepository viewerVoteWinStatsRepository, PlaylistGroupRepository playlistGroupRepository,
                       PsaSequenceRepository psaSequenceRepository, AuthUtil authUtil) {
    this.remoteRepository = remoteRepository;
    this.remoteJukeRepository = remoteJukeRepository;
    this.remotePreferenceRepository = remotePreferenceRepository;
    this.playlistRepository = playlistRepository;
    this.fppScheduleRepository = fppScheduleRepository;
    this.currentPlaylistRepository = currentPlaylistRepository;
    this.remoteViewerVoteRepository = remoteViewerVoteRepository;
    this.viewerVoteWinStatsRepository = viewerVoteWinStatsRepository;
    this.playlistGroupRepository = playlistGroupRepository;
    this.psaSequenceRepository = psaSequenceRepository;
    this.authUtil = authUtil;
  }

  public ResponseEntity<NextPlaylistResponse> nextPlaylistInQueue(Boolean updateQueue) {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
    List<RemoteJuke> remoteJukeList = this.remoteJukeRepository.findAllByRemoteToken(remoteToken);
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteToken(remoteToken);
    Optional<RemoteJuke> currentSequence = remoteJukeList.stream().filter(juke -> StringUtils.isNotEmpty(juke.getNextPlaylist())).findFirst();
    NextPlaylistResponse nextPlaylistResponse = NextPlaylistResponse.builder()
            .nextPlaylist(null)
            .playlistIndex(-1)
            .updateQueue(updateQueue)
            .build();
    if(currentSequence.isPresent()) {
      nextPlaylistResponse = NextPlaylistResponse.builder()
              .nextPlaylist(currentSequence.get().getNextPlaylist())
              .playlistIndex(-1)
              .updateQueue(updateQueue)
              .build();
      Optional<Playlist> currentSequenceDetails = playlists.stream().filter(playlist -> StringUtils.equalsIgnoreCase(playlist.getSequenceName(), currentSequence.get().getNextPlaylist())).findFirst();
      if(currentSequenceDetails.isPresent()) {
        if(StringUtils.isNotEmpty(currentSequenceDetails.get().getSequenceGroup())) {
          Optional<PlaylistGroup> playlistGroup = this.playlistGroupRepository.findByRemoteTokenAndSequenceGroupName(remoteToken, currentSequenceDetails.get().getSequenceGroup());
          if(playlistGroup.isPresent()) {
            playlistGroup.get().setSequenceGroupVisibleCount(remotePreference.getHideSequenceCount() + playlistGroup.get().getSequencesInGroup() + 1);
            nextPlaylistResponse.setPlaylistIndex(currentSequenceDetails.get().getSequenceIndex());
            this.playlistGroupRepository.save(playlistGroup.get());
          }
        }else {
          currentSequenceDetails.get().setSequenceVisibleCount(remotePreference.getHideSequenceCount() + 2);
          nextPlaylistResponse.setPlaylistIndex(currentSequenceDetails.get().getSequenceIndex());
          this.playlistRepository.save(currentSequenceDetails.get());
        }
      }
      if(updateQueue) {
        Optional<RemoteJuke> nextSequence = remoteJukeList.stream().filter(remoteJuke -> !StringUtils.isEmpty(remoteJuke.getFuturePlaylist())).findFirst();
        this.updateQueue(currentSequence, nextSequence);
      }
    }
    return ResponseEntity.status(200).body(nextPlaylistResponse);
  }

  public ResponseEntity<PluginResponse> updatePlaylistQueue(String remoteToken) {
    if(remoteToken == null) {
      return ResponseEntity.status(401).build();
    }
    List<RemoteJuke> remoteJukeList = this.remoteJukeRepository.findAllByRemoteTokenOrderByFuturePlaylistSequenceAsc(remoteToken);
    Optional<RemoteJuke> currentSequence = remoteJukeList.stream().filter(remoteJuke -> !StringUtils.isEmpty(remoteJuke.getNextPlaylist())).findFirst();
    Optional<RemoteJuke> nextSequence = remoteJukeList.stream().filter(remoteJuke -> !StringUtils.isEmpty(remoteJuke.getFuturePlaylist())).findFirst();
    if(currentSequence.isPresent()) {
      this.updateQueue(currentSequence, nextSequence);
      return ResponseEntity.status(200).body(PluginResponse.builder().message("Success").build());
    }else {
      return ResponseEntity.status(200).body(PluginResponse.builder().message("Queue Empty").build());
    }
  }

  public ResponseEntity<PluginResponse> syncPlaylists(SyncPlaylistRequest request) {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenOrderBySequenceOrderAsc(remoteToken);

    //Delete Sequences (set to inactive)
    List<String> playlistNamesInRequest = request.getPlaylists().stream().map(SyncPlaylistDetails::getPlaylistName).toList();
    List<Playlist> playlistsToDelete = new ArrayList<>();
    int inactiveSequenceOrder = request.getPlaylists().size() + 1;
    for(Playlist existingPlaylist : playlists) {
      if(!playlistNamesInRequest.contains(existingPlaylist.getSequenceName())) {
        existingPlaylist.setIsSequenceActive(false);
        existingPlaylist.setSequenceIndex(-1);
        existingPlaylist.setSequenceOrder(inactiveSequenceOrder);
        playlistsToDelete.add(existingPlaylist);
        inactiveSequenceOrder++;
      }
    }
    this.playlistRepository.saveAll(playlistsToDelete.stream().toList());

    //Add Sequences
    Map<Long, String> existingPlaylists = playlists.stream().collect(Collectors.toMap(Playlist::getSequenceKey, Playlist::getSequenceName));
    List<Playlist> playlistsToSync = new ArrayList<>();
    AtomicInteger playlistOrderStart = new AtomicInteger(1);
    for(SyncPlaylistDetails playlistInRequest : request.getPlaylists()) {
      if(!existingPlaylists.containsValue(playlistInRequest.getPlaylistName())) {
        playlistsToSync.add(Playlist.builder()
                .isSequenceActive(true)
                .ownerVoted(false)
                .remoteToken(remoteToken)
                .sequenceDisplayName(playlistInRequest.getPlaylistName())
                .sequenceDuration(playlistInRequest.getPlaylistDuration())
                .sequenceImageUrl("")
                .sequenceIndex(playlistInRequest.getPlaylistIndex() != null ? playlistInRequest.getPlaylistIndex() : -1)
                .sequenceName(playlistInRequest.getPlaylistName())
                .sequenceOrder(playlistOrderStart.get())
                .sequenceVisible(true)
                .sequenceVisibleCount(0)
                .sequenceVotes(0)
                .sequenceVotesTotal(0)
                .sequenceVoteTime(ZonedDateTime.now())
                .sequenceType(playlistInRequest.getPlaylistType() == null ? "SEQUENCE" : playlistInRequest.getPlaylistType())
                .build());
        playlistOrderStart.getAndIncrement();
      }else {
        playlists.forEach(playlist -> {
          if(StringUtils.equalsIgnoreCase(playlist.getSequenceName(), playlistInRequest.getPlaylistName())) {
            playlist.setSequenceIndex(playlistInRequest.getPlaylistIndex() != null ? playlistInRequest.getPlaylistIndex() : -1);
            playlist.setIsSequenceActive(true);
            playlist.setSequenceOrder(playlistOrderStart.get());
            playlistsToSync.add(playlist);
            playlistOrderStart.getAndIncrement();
          }
        });
      }
    }
    this.playlistRepository.saveAll(playlistsToSync.stream().toList());

    //Check PSA Sequences and Delete if not in sync list
    List<PsaSequence> psaSequenceList = this.psaSequenceRepository.findAllByRemoteToken(remoteToken);
    if(CollectionUtils.isNotEmpty(psaSequenceList)) {
      psaSequenceList.forEach(psa -> {
        if(!playlistNamesInRequest.contains(psa.getPsaSequenceName())) {
          this.psaSequenceRepository.delete(psa);
        }
      });
      //If there are none left, turn off PSA
      psaSequenceList = this.psaSequenceRepository.findAllByRemoteToken(remoteToken);
      if(CollectionUtils.isEmpty(psaSequenceList)) {
        RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
        remotePreference.setPsaEnabled(false);
        this.remotePreferenceRepository.save(remotePreference);
      }
    }

    return ResponseEntity.status(200).body(PluginResponse.builder().message("Success").build());
  }

  public ResponseEntity<PluginResponse> updateWhatsPlaying(UpdateWhatsPlayingRequest request) {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    if(StringUtils.isEmpty(request.getPlaylist())) {
      this.fppScheduleRepository.deleteByRemoteToken(remoteToken);
      this.currentPlaylistRepository.deleteByRemoteToken(remoteToken);
    }else {
      Optional<CurrentPlaylist> currentPlaylist = this.currentPlaylistRepository.findByRemoteToken(remoteToken);
      if(currentPlaylist.isPresent()) {
        currentPlaylist.get().setCurrentPlaylist(request.getPlaylist());
        this.currentPlaylistRepository.save(currentPlaylist.get());
      }else {
        this.currentPlaylistRepository.save(CurrentPlaylist.builder().remoteToken(remoteToken).currentPlaylist(request.getPlaylist()).build());
      }
    }

    this.updateSequenceHideCounts(remoteToken);

    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
    remotePreference.setSequencesPlayed(remotePreference.getSequencesPlayed() + 1);

    //PSA
    if(remotePreference.getPsaEnabled() && remotePreference.getManagePsa()) {
      int sequencesPlayed = remotePreference.getSequencesPlayed();
      if(sequencesPlayed != 0 && sequencesPlayed % remotePreference.getPsaFrequency() == 0) {
        Optional<PsaSequence> psaSequence = this.psaSequenceRepository.findFirstByRemoteTokenOrderByPsaSequenceLastPlayedAscPsaSequenceOrderAsc(remoteToken);
        if(psaSequence.isPresent()) {
          List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(remoteToken, true);
          Optional<Playlist> psaPlaylist = playlists.stream().filter(playlist -> StringUtils.equalsIgnoreCase(psaSequence.get().getPsaSequenceName(), playlist.getSequenceName())).findFirst();
          if(psaPlaylist.isPresent()) {
            if(StringUtils.equalsIgnoreCase("VOTING", remotePreference.getViewerControlMode())) {
              psaPlaylist.get().setSequenceVotes(11111);
              this.playlistRepository.save(psaPlaylist.get());
            }else {
              this.remoteJukeRepository.save(RemoteJuke.builder()
                              .remoteToken(remoteToken)
                              .nextPlaylist(psaPlaylist.get().getSequenceName())
                              .ownerRequested(true)
                      .build());
            }

            psaSequence.get().setPsaSequenceLastPlayed(ZonedDateTime.now());
            this.psaSequenceRepository.save(psaSequence.get());
          }
        }
      }
      List<PsaSequence> psaSequences = this.psaSequenceRepository.findAllByRemoteToken(remoteToken);
      boolean isPsaPlaying = psaSequences.stream().anyMatch(psaSequence -> StringUtils.equalsIgnoreCase(request.getPlaylist(), psaSequence.getPsaSequenceName()));
      if(isPsaPlaying) {
        remotePreference.setSequencesPlayed(remotePreference.getSequencesPlayed() - 1);
      }
      this.remotePreferenceRepository.save(remotePreference);
    }

    return ResponseEntity.status(200).body(PluginResponse.builder().currentPlaylist(request.getPlaylist()).build());
  }

  public ResponseEntity<PluginResponse> updateNextScheduledSequence(UpdateNextScheduledRequest request) {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    if(StringUtils.isEmpty(request.getSequence())) {
      this.fppScheduleRepository.deleteByRemoteToken(remoteToken);
    }else {
      Optional<FppSchedule> nextPlaylist = this.fppScheduleRepository.findByRemoteToken(remoteToken);
      if(nextPlaylist.isPresent()) {
        nextPlaylist.get().setNextScheduledSequence(request.getSequence());
        this.fppScheduleRepository.save(nextPlaylist.get());
      }else {
        this.fppScheduleRepository.save(FppSchedule.builder().nextScheduledSequence(request.getSequence()).remoteToken(remoteToken).build());
      }
    }
    return ResponseEntity.status(200).body(PluginResponse.builder().nextScheduledSequence(request.getSequence()).build());
  }

  public ResponseEntity<PluginResponse> viewerControlMode() {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
    return ResponseEntity.status(200).body(PluginResponse.builder().viewerControlMode(remotePreference.getViewerControlMode()).build());
  }

  public ResponseEntity<HighestVotedPlaylistResponse> highestVotedPlaylist() {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    this.remoteViewerVoteRepository.deleteAllByRemoteToken(remoteToken);

    //Get sequences with votes.
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(remoteToken, true);
    //Get the sequence with most votes.
    Optional<Playlist> highestVotedPlaylist = playlists.size() > 0 && playlists.get(0).getSequenceVotes() != 0 && playlists.get(0).getSequenceVotes() != -1 ? Optional.of(playlists.get(0)) : Optional.empty();

    //Get sequence groups with votes.
    List<PlaylistGroup> playlistGroups = this.playlistGroupRepository.findAllByRemoteTokenOrderBySequenceGroupVotesDesc(remoteToken);
    //Get the highest voted sequence group
    Optional<PlaylistGroup> highestVotedPlaylistGroup = playlistGroups.size() > 0 && playlistGroups.get(0).getSequenceGroupVotes() != 0 && playlistGroups.get(0).getSequenceGroupVotes() != -1 ? Optional.of(playlistGroups.get(0)) : Optional.empty();

    //Determine if a sequence group won the voting round and set the votes for each sequence in the group.
    setSequenceVotesForGroup(remoteToken, highestVotedPlaylist, playlistGroups, highestVotedPlaylistGroup);

    //Maybe find a way to utilize recursion here to prevent duplication. As is it fetches the highest voted sequence in
    //the group that just (maybe) won.
    playlists = this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceVotesDescSequenceVoteTimeAsc(remoteToken, true);
    highestVotedPlaylist = playlists.size() > 0 && playlists.get(0).getSequenceVotes() != 0 ? Optional.of(playlists.get(0)) : Optional.empty();

    //Determine if the highest voted sequence is part of a group.
    boolean highestVotedIsGrouped = highestVotedPlaylist.isPresent() && StringUtils.isNotEmpty(highestVotedPlaylist.get().getSequenceGroup());

    HighestVotedPlaylistResponse response = HighestVotedPlaylistResponse.builder()
            .winningPlaylist(null)
            .playlistIndex(-1)
            .build();
    if(highestVotedPlaylist.isPresent()) {
      response = HighestVotedPlaylistResponse.builder()
              .winningPlaylist(highestVotedPlaylist.get().getSequenceName())
              .playlistIndex(highestVotedPlaylist.get().getSequenceIndex())
              .build();

      boolean isWinningSequencePsa = false;
      List<PsaSequence> psaSequenceList = this.psaSequenceRepository.findAllByRemoteToken(remoteToken);
      if(CollectionUtils.isNotEmpty(psaSequenceList)) {
        for(PsaSequence psaSequence : psaSequenceList) {
          if(StringUtils.equalsIgnoreCase(psaSequence.getPsaSequenceName(), highestVotedPlaylist.get().getSequenceName())) {
            isWinningSequencePsa = true;
          }
        }
      }

      //If the highest voted sequence is a group, skip the part that inserts win stats, since this is done in the
      //setSequenceVotesForGroup function.
      if(!highestVotedIsGrouped && !isWinningSequencePsa) {
        ViewerVoteWinStats viewerVoteWinStats = ViewerVoteWinStats.builder()
                .remoteToken(remoteToken)
                .playlistName(highestVotedPlaylist.get().getSequenceName())
                .voteWinDateTime(ZonedDateTime.now())
                .totalVotes(highestVotedPlaylist.get().getSequenceVotes())
                .build();
        this.viewerVoteWinStatsRepository.save(viewerVoteWinStats);
      }

      //Reset all votes if toggle is on.
      RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
      if(remotePreference.getResetVotes() && !isWinningSequencePsa) {
        List<Playlist> nonGroupedPlaylists = playlists.stream()
                .filter(playlist -> StringUtils.isEmpty(playlist.getSequenceGroup())).toList();
        if(remotePreference.getPsaEnabled()) {
          List<String> psaSequenceNames = psaSequenceList.stream().map(PsaSequence::getPsaSequenceName).toList();
          nonGroupedPlaylists = nonGroupedPlaylists.stream()
                  .filter(playlist -> !psaSequenceNames.contains(playlist.getSequenceName()))
                  .collect(Collectors.toList());
        }
        nonGroupedPlaylists.forEach(playlist -> playlist.setSequenceVotes(0));
        this.playlistRepository.saveAll(playlists);

        List<PlaylistGroup> playlistGroupsToReset = new ArrayList<>();
        for(PlaylistGroup playlistGroup : playlistGroups) {
          if(!StringUtils.equalsIgnoreCase(highestVotedPlaylist.get().getSequenceGroup(), playlistGroup.getSequenceGroupName())) {
            playlistGroupsToReset.add(playlistGroup);
          }
        }
        playlistGroupsToReset.forEach(playlistGroup -> playlistGroup.setSequenceGroupVotes(0));
        this.playlistGroupRepository.saveAll(playlistGroups);
      }

      //Reset sequence votes for sequences that won previous voting rounds.
      List<Playlist> playedVotesToReset = playlists.stream()
              .filter(playlist -> playlist.getSequenceVotes() == -1)
              .collect(Collectors.toList());
      playedVotesToReset.forEach(playlist -> playlist.setSequenceVotes(0));
      this.playlistRepository.saveAll(playedVotesToReset);

      //Reset sequence group votes for sequence groups that won previous voting rounds.
      if(!highestVotedIsGrouped || (highestVotedPlaylistGroup.isPresent() && !StringUtils.equalsIgnoreCase(highestVotedPlaylist.get().getSequenceGroup(), highestVotedPlaylistGroup.get().getSequenceGroupName()))) {
        List<PlaylistGroup> playedGroupVotesToReset = playlistGroups.stream()
                .filter(playlist -> playlist.getSequenceGroupVotes() == -1).toList();
        playedGroupVotesToReset.forEach(playlist -> playlist.setSequenceGroupVotes(0));
        this.playlistRepository.saveAll(playedVotesToReset);
      }

      //Set the sequence votes to -1 for the winning sequence, or 0 if the sequence is grouped.
      // While we're at it, reset owner voted if it was... owner voted
      highestVotedPlaylist.get().setOwnerVoted(false);
      highestVotedPlaylist.get().setSequenceVotes(highestVotedIsGrouped ? 0 : -1);
      this.playlistRepository.save(highestVotedPlaylist.get());

      //PSA
      if(remotePreference.getPsaEnabled() && !isWinningSequencePsa && !remotePreference.getManagePsa()) {
        ZonedDateTime todayOhHundred = ZonedDateTime.now().withHour(0).withMinute(0).withSecond(0);
        int voteWinCounts = this.viewerVoteWinStatsRepository.countAllByRemoteTokenAndVoteWinDateTimeAfter(remoteToken, todayOhHundred);
        if(voteWinCounts != 0 && voteWinCounts % remotePreference.getPsaFrequency() == 0) {
          Optional<PsaSequence> psaSequence = this.psaSequenceRepository.findFirstByRemoteTokenOrderByPsaSequenceLastPlayedAscPsaSequenceOrderAsc(remoteToken);
          if(psaSequence.isPresent()) {
            Optional<Playlist> psaPlaylist = playlists.stream().filter(playlist -> StringUtils.equalsIgnoreCase(psaSequence.get().getPsaSequenceName(), playlist.getSequenceName())).findFirst();
            if(psaPlaylist.isPresent()) {
              psaPlaylist.get().setSequenceVotes(11111);
              this.playlistRepository.save(psaPlaylist.get());

              psaSequence.get().setPsaSequenceLastPlayed(ZonedDateTime.now());
              this.psaSequenceRepository.save(psaSequence.get());
            }
          }
        }
      }

      //Update hide sequence counts.
      if(remotePreference.getHideSequenceCount() != 0) {
        if(!highestVotedIsGrouped) {
          highestVotedPlaylist.get().setSequenceVisibleCount(remotePreference.getHideSequenceCount() + 2);
          this.playlistRepository.save(highestVotedPlaylist.get());
        }else {
          if(highestVotedPlaylistGroup.isPresent()) {
            highestVotedPlaylistGroup.get().setSequenceGroupVisibleCount(remotePreference.getHideSequenceCount() + highestVotedPlaylistGroup.get().getSequencesInGroup() + 1);
            this.playlistGroupRepository.save(highestVotedPlaylistGroup.get());
          }
        }
      }
    }else {
      //If no votes were made
      List<Playlist> playedVotesToReset = playlists.stream()
              .filter(playlist -> playlist.getSequenceVotes() == -1).toList();
      playedVotesToReset.forEach(playlist -> playlist.setSequenceVotes(0));
      this.playlistRepository.saveAll(playedVotesToReset);
      List<PlaylistGroup> playedGroupVotesToReset = playlistGroups.stream()
              .filter(playlist -> playlist.getSequenceGroupVotes() == -1).toList();
      playedGroupVotesToReset.forEach(playlist -> playlist.setSequenceGroupVotes(0));
      this.playlistGroupRepository.saveAll(playedGroupVotesToReset);
    }

    //Reset all owner votes

    return ResponseEntity.status(200).body(response);
  }

  private void setSequenceVotesForGroup(String remoteToken, Optional<Playlist> highestVotedPlaylist,
                                        List<PlaylistGroup> playlistGroups, Optional<PlaylistGroup> highestVotedPlaylistGroup) {
    boolean didGroupWin = highestVotedPlaylist.isEmpty() && highestVotedPlaylistGroup.isPresent();
    if(highestVotedPlaylist.isPresent() && highestVotedPlaylistGroup.isPresent()
            && highestVotedPlaylistGroup.get().getSequenceGroupVotes() > highestVotedPlaylist.get().getSequenceVotes()) {
      didGroupWin = true;
    }
    if(highestVotedPlaylist.isPresent() && highestVotedPlaylistGroup.isPresent()
            && Objects.equals(highestVotedPlaylistGroup.get().getSequenceGroupVotes(), highestVotedPlaylist.get().getSequenceVotes())
            && highestVotedPlaylistGroup.get().getSequenceGroupVoteTime().isBefore(highestVotedPlaylist.get().getSequenceVoteTime())) {
      didGroupWin = true;
    }

    if(didGroupWin) {
      List<Playlist> playlistsInGroup = this.playlistRepository.findAllByRemoteTokenAndSequenceGroupOrderBySequenceOrderDesc(remoteToken, highestVotedPlaylistGroup.get().getSequenceGroupName());
      List<Playlist> playlistsToUpdate = new ArrayList<>();
      int sequenceVotes = 22222;
      for(Playlist playlistInGroup : playlistsInGroup) {
        playlistInGroup.setSequenceVotes(sequenceVotes);
        playlistsToUpdate.add(playlistInGroup);
        sequenceVotes++;
      }
      this.playlistRepository.saveAll(playlistsToUpdate.stream().toList());

      ViewerVoteWinStats viewerVoteWinStats = ViewerVoteWinStats.builder()
              .remoteToken(remoteToken)
              .playlistName(highestVotedPlaylistGroup.get().getSequenceGroupName())
              .voteWinDateTime(ZonedDateTime.now())
              .totalVotes(highestVotedPlaylistGroup.get().getSequenceGroupVotes())
              .build();
      this.viewerVoteWinStatsRepository.save(viewerVoteWinStats);

      highestVotedPlaylistGroup.get().setSequenceGroupVotes(-1);
      this.playlistGroupRepository.save(highestVotedPlaylistGroup.get());
    }
  }

  public ResponseEntity<PluginResponse> pluginVersion(PluginVersion request) {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    Remote remote = this.remoteRepository.findByRemoteToken(remoteToken);
    remote.setPluginVersion(request.getPluginVersion());
    remote.setFppVersion(request.getFppVersion());
    this.remoteRepository.save(remote);
    return ResponseEntity.status(200).body(PluginResponse.builder().message("Success").build());
  }

  public ResponseEntity<RemotePreferenceResponse> remotePreferences() {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    Remote remote = this.remoteRepository.findByRemoteToken(remoteToken);
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
    if(remote == null || remotePreference == null) {
      return ResponseEntity.status(204).build();
    }
    return ResponseEntity.status(200).body(RemotePreferenceResponse.builder()
            .viewerControlMode(remotePreference.getViewerControlMode())
            .remoteSubdomain(remote.getRemoteSubdomain())
            .interruptSchedule(remotePreference.getInterruptSchedule())
            .build());
  }

  public ResponseEntity<PluginResponse> purgeQueue() {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    this.remoteJukeRepository.deleteByRemoteToken(remoteToken);
    this.resetAllVotes();
    return ResponseEntity.status(200).body(PluginResponse.builder().message("Success").build());
  }

  public ResponseEntity<PluginResponse> resetAllVotes() {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteTokenAndIsSequenceActiveOrderBySequenceOrderAsc(remoteToken, true);
    playlists.forEach(playlist -> {
      playlist.setSequenceVotes(0);
      playlist.setSequenceVisibleCount(0);
      playlist.setSequenceVotes(0);
    });
    this.playlistRepository.saveAll(playlists.stream().toList());
    List<PlaylistGroup> playlistGroups = this.playlistGroupRepository.findAllByRemoteToken(remoteToken);
    playlistGroups.forEach(playlistGroup -> {
      playlistGroup.setSequenceGroupVotes(0);
      playlistGroup.setSequenceGroupVisibleCount(0);
      playlistGroup.setSequenceGroupVotes(0);
    });
    this.playlistGroupRepository.saveAll(playlistGroups.stream().toList());
    List<RemoteViewerVote> remoteViewerVotes = this.remoteViewerVoteRepository.findAllByRemoteToken(remoteToken);
    this.remoteViewerVoteRepository.deleteAll(remoteViewerVotes.stream().toList());
    return ResponseEntity.status(200).body(PluginResponse.builder().message("Success").build());
  }

  public ResponseEntity<PluginResponse> toggleViewerControl() {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
    remotePreference.setViewerControlEnabled(!remotePreference.getViewerControlEnabled());
    this.remotePreferenceRepository.save(remotePreference);
    return ResponseEntity.status(200).body(PluginResponse.builder().viewerControlEnabled(remotePreference.getViewerControlEnabled()).build());
  }

  public ResponseEntity<PluginResponse> updateViewerControl(ViewerControlRequest request) {
    String remoteToken = this.authUtil.getRemoteTokenFromHeader();
    RemotePreference remotePreference = this.remotePreferenceRepository.findByRemoteToken(remoteToken);
    remotePreference.setViewerControlEnabled(StringUtils.equalsIgnoreCase("Y", request.getViewerControlEnabled()));
    remotePreference.setSequencesPlayed(0);
    this.remotePreferenceRepository.save(remotePreference);
    return ResponseEntity.status(200).body(PluginResponse.builder().viewerControlEnabled(StringUtils.equalsIgnoreCase("Y", request.getViewerControlEnabled())).build());
  }

  private void updateQueue(Optional<RemoteJuke> currentSequence, Optional<RemoteJuke> nextSequence) {
    if(currentSequence.isPresent()) {
      if(nextSequence.isPresent()) {
        currentSequence.get().setNextPlaylist(nextSequence.get().getFuturePlaylist());
        this.remoteJukeRepository.save(currentSequence.get());
        this.remoteJukeRepository.delete(nextSequence.get());
      }else {
        this.remoteJukeRepository.delete(currentSequence.get());
      }
    }
  }

  //TODO - Need this same function for sequence groups.
  private void updateSequenceHideCounts(String remoteToken) {
    List<Playlist> playlists = this.playlistRepository.findAllByRemoteToken(remoteToken);
    List<Playlist> playlistsToUpdate = playlists.stream()
            .filter(playlist -> playlist.getSequenceVisibleCount() != 0).toList();
    playlistsToUpdate.forEach(playlist -> playlist.setSequenceVisibleCount(playlist.getSequenceVisibleCount() - 1));
    this.playlistRepository.saveAll(playlistsToUpdate.stream().toList());

    List<PlaylistGroup> playlistGroups = this.playlistGroupRepository.findAllByRemoteToken(remoteToken);
    List<PlaylistGroup> playlistGroupsToUpdate = playlistGroups.stream()
            .filter(group -> group.getSequenceGroupVisibleCount() != 0).toList();
    playlistGroupsToUpdate.forEach(group -> group.setSequenceGroupVisibleCount(group.getSequenceGroupVisibleCount() - 1));
    this.playlistGroupRepository.saveAll(playlistGroupsToUpdate.stream().toList());
  }
}
