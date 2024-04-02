package com.remotefalcon.api.response.dashboard;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class DashboardLiveStatsResponse {
    private Integer activeViewers;
    private Integer totalViewers;
    private Integer currentRequests;
    private Integer totalRequests;
}
