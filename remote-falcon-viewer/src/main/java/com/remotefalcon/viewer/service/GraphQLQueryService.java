package com.remotefalcon.viewer.service;

import com.remotefalcon.viewer.documents.Show;
import com.remotefalcon.viewer.documents.models.Page;
import com.remotefalcon.viewer.documents.models.Sequence;
import com.remotefalcon.viewer.enums.StatusResponse;
import com.remotefalcon.viewer.repository.ShowRepository;
import com.remotefalcon.viewer.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GraphQLQueryService {
    private final AuthUtil authUtil;
    private final ShowRepository showRepository;

    public Show getShow() {
        Optional<Show> show = this.showRepository.findByShowSubdomain(authUtil.tokenDTO.getShowSubdomain());
        if(show.isPresent()) {
            show.get().setLastLoginDate(LocalDateTime.now());
            this.showRepository.save(show.get());
            List<Sequence> sequences = show.get().getSequences();
            sequences.sort(Comparator.comparing(Sequence::getOrder));
            show.get().setSequences(sequences);
            return show.get();
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public String activeViewerPage() {
        Optional<Show> show = this.showRepository.findByShowSubdomain(authUtil.tokenDTO.getShowSubdomain());
        if(show.isPresent() && show.get().getPages() != null) {
            Optional<Page> activeViewerPage = show.get().getPages().stream().filter(Page::getActive).findFirst();
            if(activeViewerPage.isPresent()) {
                return activeViewerPage.get().getHtml();
            }
            return "";
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }
}
