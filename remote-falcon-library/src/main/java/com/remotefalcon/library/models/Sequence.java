package com.remotefalcon.library.models;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Sequence {
    private String name;
    private Long key;
    private String displayName;
    private Integer duration;
    private Boolean visible;
    private Integer index;
    private Integer order;
    private String imageUrl;
    private Boolean active;
    private Integer visibilityCount;
    private String type;
    private String group;
    private String category;
    private String artist;
}
