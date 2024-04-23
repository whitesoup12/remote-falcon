package com.remotefalcon.library.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SequenceGroup {
    private String name;
    private Integer visibilityCount;
}
