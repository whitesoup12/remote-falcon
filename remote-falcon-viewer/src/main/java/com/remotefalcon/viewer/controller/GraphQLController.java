package com.remotefalcon.viewer.controller;

import com.remotefalcon.viewer.aop.RequiresAccess;
import com.remotefalcon.viewer.documents.Show;
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
