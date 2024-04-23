package com.remotefalcon.viewer.service;

import com.remotefalcon.library.documents.Show;
import com.remotefalcon.library.enums.StatusResponse;
import com.remotefalcon.library.models.Page;
import com.remotefalcon.library.models.Sequence;
import com.remotefalcon.library.models.SequenceGroup;
import com.remotefalcon.viewer.repository.ShowRepository;
import com.remotefalcon.viewer.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
            show.get().setSequences(this.processSequencesForViewer(show.get()));
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

    private List<Sequence> processSequencesForViewer(Show show) {
        this.sortAndFilterSequences(show.getSequences());
        this.filterSequenceGroups(show.getSequenceGroups());
        List<Sequence> sequencesWithGroups = this.replaceSequencesWithSequenceGroups(show.getSequences(), show.getSequenceGroups());
        return sequencesWithGroups;
    }

    private void sortAndFilterSequences(List<Sequence> sequences) {
        sequences.sort(Comparator.comparing(Sequence::getOrder));
        sequences = sequences.stream()
                .filter(sequence -> sequence.getVisibilityCount() == 0)
                .toList();
    }

    private void filterSequenceGroups(List<SequenceGroup> sequenceGroups) {
        sequenceGroups = sequenceGroups.stream()
                .filter(group -> group.getVisibilityCount() == 0)
                .toList();
    }

    private List<Sequence> replaceSequencesWithSequenceGroups(List<Sequence> sequences, List<SequenceGroup> sequenceGroups) {
        List<Sequence> sequencesWithGroups = new ArrayList<>();
        List<String> groupsAdded = new ArrayList<>();
        for(Sequence sequence: sequences) {
            if(StringUtils.isNotEmpty(sequence.getGroup())) {
                Optional<SequenceGroup> sequenceGroup = sequenceGroups.stream()
                        .filter(group -> StringUtils.equalsIgnoreCase(sequence.getGroup(), group.getName()))
                        .findFirst();
                if(sequenceGroup.isPresent() && !groupsAdded.contains(sequence.getGroup())) {
                    groupsAdded.add(sequence.getGroup());

                    sequence.setName(sequenceGroup.get().getName());
                    sequence.setDisplayName(sequenceGroup.get().getName());
                    sequence.setVisibilityCount(sequenceGroup.get().getVisibilityCount());

                    sequencesWithGroups.add(sequence);
                }
            }else {
                sequencesWithGroups.add(sequence);
            }
        }
        return sequencesWithGroups;
    }
}
