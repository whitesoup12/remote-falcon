package com.remotefalcon.api.documents.models;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SequenceGroup {
    private String name;
    private Integer votes;
    private LocalDateTime lastVoteTime;
    private Integer totalVotes;
    private Integer visibilityCount;
}
