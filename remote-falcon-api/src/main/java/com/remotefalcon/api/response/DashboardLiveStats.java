package com.remotefalcon.api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardLiveStats {
    private Integer activeViewers;
    private Integer totalViewers;
    private Integer currentRequests;
    private Integer totalRequests;
}
