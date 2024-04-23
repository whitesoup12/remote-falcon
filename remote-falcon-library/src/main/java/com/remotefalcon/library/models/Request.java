package com.remotefalcon.library.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Request {
    private Sequence sequence;
    private Integer position;
    private Boolean ownerRequested;
}
