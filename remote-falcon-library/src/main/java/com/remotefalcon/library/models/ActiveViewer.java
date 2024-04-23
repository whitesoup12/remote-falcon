package com.remotefalcon.library.models;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActiveViewer {
    private String ipAddress;
    private LocalDateTime visitDateTime;
}
