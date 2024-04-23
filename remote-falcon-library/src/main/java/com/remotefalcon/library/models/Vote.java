package com.remotefalcon.library.models;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class Vote {
    private Sequence sequence;
    private Integer votes;
    private List<String> viewersVoted;
    private LocalDateTime lastVoteTime;
    private Boolean ownerVoted;
}
