package com.remotefalcon.api.documents.models;

import jakarta.persistence.Transient;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SequenceGroup {
    private String name;
    private Integer votes;
    private LocalDateTime lastVoteTime;
    private Integer totalVotes;
    private Integer visibilityCount;

    @Transient
    List<String> sequencesInGroup;
}
