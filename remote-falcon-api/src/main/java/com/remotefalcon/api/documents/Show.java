package com.remotefalcon.api.documents;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.remotefalcon.api.documents.models.*;
import com.remotefalcon.api.enums.UserRole;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@Document
public class Show {
    @Id
    private String id;
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
    private String facebookUrl;
    private String youtubeUrl;
    private UserRole userRole;
    private String apiAccessToken;
    private String apiAccessSecret;
    private Boolean apiAccessActive;
    private String passwordResetLink;
    private LocalDateTime passwordResetExpiry;

    private Preference preference;
    private List<Sequence> sequences;
    private List<SequenceGroup> sequenceGroups;
    private List<PSASequence> psaSequences;
    private List<Page> pages;
    private Stat stat;

    @JsonIgnore
    private String serviceToken;
}
