package com.remotefalcon.controlpanel.documents;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.remotefalcon.controlpanel.documents.models.*;
import com.remotefalcon.controlpanel.enums.ShowRole;
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
    private Boolean emailVerified;
    private LocalDateTime createdDate;
    private LocalDateTime lastLoginDate;
    private LocalDateTime expireDate;
    private String pluginVersion;
    private String fppVersion;
    private String lastLoginIp;
    private ShowRole showRole;
    private String passwordResetLink;
    private LocalDateTime passwordResetExpiry;

    private ApiAccess apiAccess;
    private UserProfile userProfile;
    private Preference preferences;
    private List<Sequence> sequences;
    private List<SequenceGroup> sequenceGroups;
    private List<PsaSequence> psaSequences;
    private List<Page> pages;
    private Stat stats;

    @JsonIgnore
    private String serviceToken;
}
