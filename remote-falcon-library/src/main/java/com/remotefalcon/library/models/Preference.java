package com.remotefalcon.library.models;

import com.remotefalcon.library.enums.LocationCheckMethod;
import com.remotefalcon.library.enums.ViewerControlMode;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Preference {
    private Boolean viewerControlEnabled;
    private ViewerControlMode viewerControlMode;
    private Boolean resetVotes;
    private Integer jukeboxDepth;
    private LocationCheckMethod locationCheckMethod;
    private Float showLatitude;
    private Float showLongitude;
    private Float allowedRadius;
    private Boolean checkIfVoted;
    private Boolean psaEnabled;
    private Integer psaFrequency;
    private Integer jukeboxRequestLimit;
    private Integer locationCode;
    private Integer hideSequenceCount;
    private Boolean makeItSnow;
    private Boolean managePsa;
    private Integer sequencesPlayed;
    private String pageTitle;
    private String pageIconUrl;
}
