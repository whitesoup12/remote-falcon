package com.remotefalcon.api.documents;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document
public class Notification {
    @Id
    private String id;
    private String subject;
    private String message;
}
