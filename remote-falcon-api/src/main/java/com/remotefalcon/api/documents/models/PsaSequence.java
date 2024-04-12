package com.remotefalcon.api.documents.models;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PsaSequence {
    private String name;
    private Integer order;
    private LocalDateTime lastPlayed;
}
