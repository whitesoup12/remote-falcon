package com.remotefalcon.viewer.controller;

import com.remotefalcon.library.documents.Show;
import com.remotefalcon.viewer.aop.RequiresAccess;
import com.remotefalcon.viewer.service.GraphQLMutationService;
import com.remotefalcon.viewer.service.GraphQLQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
public class GraphQLController {
    private final GraphQLMutationService graphQLMutationService;
    private final GraphQLQueryService graphQLQueryService;

    /********
    Mutations
     ********/
    @MutationMapping
    @RequiresAccess
    public Boolean insertViewerPageStats(@Argument LocalDateTime date) {
        return graphQLMutationService.insertViewerPageStats(date);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updateActiveViewers() {
        return graphQLMutationService.updateActiveViewers();
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updatePlayingNow(@Argument String playingNow) {
        return graphQLMutationService.updatePlayingNow(playingNow);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updatePlayingNext(@Argument String playingNext) {
        return graphQLMutationService.updatePlayingNext(playingNext);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean addSequenceToQueue(@Argument String name, @Argument Float latitude, @Argument Float longitude) {
        return graphQLMutationService.addSequenceToQueue(name, latitude, longitude);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean voteForSequence(@Argument String name, @Argument Float latitude, @Argument Float longitude) {
        return graphQLMutationService.voteForSequence(name, latitude, longitude);
    }


    /*******
     Queries
     *******/
    @QueryMapping
    @RequiresAccess()
    public Show getShow() {
        return graphQLQueryService.getShow();
    }

    @QueryMapping
    @RequiresAccess()
    public String activeViewerPage() {
        return graphQLQueryService.activeViewerPage();
    }
}
