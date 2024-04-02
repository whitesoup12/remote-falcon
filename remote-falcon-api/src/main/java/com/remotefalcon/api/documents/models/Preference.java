package com.remotefalcon.api.documents.models;

import com.remotefalcon.api.enums.LocationCheckMethod;
import com.remotefalcon.api.enums.ViewerControlMode;
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
    private Float remoteLatitude;
    private Float remoteLongitude;
    private Float allowedRadius;
    private Boolean checkIfVoted;
    private Boolean psaEnabled;
    private String psaSequence;
    private Integer psaFrequency;
    private Integer jukeboxRequestLimit;
    private Integer jukeboxHistoryLimit;
    private String locationCode;
    private Integer hideSequenceCount;
    private Boolean makeItSnow;
    private Boolean managePsa;
    private Integer sequencesPlayed;
    private String pageTitle;
    private String pageIconUrl;
}
