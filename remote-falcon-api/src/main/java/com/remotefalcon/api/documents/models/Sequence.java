package com.remotefalcon.api.documents.models;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class Sequence {
    private String name;
    private Long key;
    private String displayName;
    private Integer duration;
    private Boolean visible;
    private Integer votes;
    private LocalDateTime lastVoteTime;
    private Integer totalVotes;
    private Integer index;
    private Integer order;
    private String imageUrl;
    private Boolean active;
    private Boolean ownerVoted;
    private Integer visibilityCount;
    private String type;
    private String group;
    private String category;
    private String artist;
}
