package com.remotefalcon.api.documents;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

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
    private Boolean emailVerified;
    private LocalDateTime createdDate;
    private LocalDateTime lastLoginDate;
    private LocalDateTime expireDate;
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

    private String passwordResetLink;
    private LocalDateTime passwordResetExpiry;

    @JsonIgnore
    private String serviceToken;
}
