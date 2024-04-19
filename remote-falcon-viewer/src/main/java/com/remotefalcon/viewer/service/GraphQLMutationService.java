package com.remotefalcon.viewer.service;

import com.remotefalcon.viewer.documents.Show;
import com.remotefalcon.viewer.documents.models.Stat;
import com.remotefalcon.viewer.enums.StatusResponse;
import com.remotefalcon.viewer.repository.ShowRepository;
import com.remotefalcon.viewer.util.AuthUtil;
import com.remotefalcon.viewer.util.ClientUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GraphQLMutationService {
    private final AuthUtil authUtil;
    private final ClientUtil clientUtil;
    private final ShowRepository showRepository;
    private final HttpServletRequest httpServletRequest;

    public Boolean insertViewerPageStats(LocalDateTime date) {
        Optional<Show> show = this.showRepository.findByShowSubdomain(authUtil.tokenDTO.getShowSubdomain());
        if(show.isPresent()) {
            String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
            if(!StringUtils.equalsIgnoreCase(show.get().getLastLoginIp(), ipAddress)) {
                show.get().getStats().getPage().add(Stat.Page.builder()
                        .ip(ipAddress)
                        .dateTime(date)
                        .build());
                this.showRepository.save(show.get());
                return true;
            }
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }
}
