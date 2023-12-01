package com.remotefalcon.api.documents;

import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.ZonedDateTime;

@Data
@Builder
@Document
public class Show {
    @Id
    private String showToken;
    private String email;
    private String password;
    private String showName;
    private String showSubdomain;
    private String firstName;
    private String lastName;
    private String remoteToken;
    private Boolean emailVerified;
    private ZonedDateTime createdDate;
    private ZonedDateTime lastLoginDate;
    private ZonedDateTime expireDate;
    private String pluginVersion;
    private String fppVersion;
    private String lastLoginIp;
    private String htmlContent;
    private String facebookUrl;
    private String youtubeUrl;
    private String userRole;

    private Boolean viewerControlEnabled;
    private String viewerControlMode;
    private Boolean resetVotes;
    private Integer jukeboxDepth;
    private Boolean enableGeolocation;
    private Float remoteLatitude;
    private Float remoteLongitude;
    private Float allowedRadius;
    private Boolean checkIfVoted;
    private Boolean interruptSchedule;
    private Boolean psaEnabled;
    private String psaSequence;
    private Integer psaFrequency;
    private Integer jukeboxRequestLimit;
    private Boolean viewerPagePublic;
    private Integer jukeboxHistoryLimit;
    private Boolean enableLocationCode;
    private String locationCode;
    private Boolean apiAccessRequested;
    private Integer autoSwitchControlModeSize;
    private Boolean autoSwitchControlModeToggled;
    private Integer hideSequenceCount;
    private Boolean makeItSnow;
    private Boolean managePsa;
    private Integer sequencesPlayed;
}
