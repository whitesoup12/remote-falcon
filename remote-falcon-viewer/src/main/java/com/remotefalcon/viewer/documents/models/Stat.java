package com.remotefalcon.viewer.documents.models;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class Stat {
    private List<Jukebox> jukebox;
    private List<Voting> voting;
    private List<VotingWin> votingWin;
    private List<Page> page;

    @Data
    @Builder
    public static class Jukebox {
        private String name;
        private LocalDateTime dateTime;
    }

    @Data
    @Builder
    public static class Page {
        private String ip;
        private LocalDateTime dateTime;
    }

    @Data
    @Builder
    public static class Voting {
        private String name;
        private LocalDateTime dateTime;
    }

    @Data
    @Builder
    public static class VotingWin {
        private String name;
        private Integer total;
        private LocalDateTime dateTime;
    }
}
