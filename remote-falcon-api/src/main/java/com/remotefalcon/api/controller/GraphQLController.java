package com.remotefalcon.api.controller;

import com.remotefalcon.api.aop.RequiresAccess;
import com.remotefalcon.api.documents.Show;
import com.remotefalcon.api.documents.models.*;
import com.remotefalcon.api.response.dashboard.DashboardLiveStatsResponse;
import com.remotefalcon.api.response.dashboard.DashboardStatsResponse;
import com.remotefalcon.api.service.DashboardService;
import com.remotefalcon.api.service.GraphQLMutationService;
import com.remotefalcon.api.service.GraphQLQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GraphQLController {
    private final GraphQLMutationService graphQLMutationService;
    private final GraphQLQueryService graphQLQueryService;
    private final DashboardService dashboardService;

    /********
    Mutations
     ********/
    @MutationMapping
    public Boolean signUp(@Argument String firstName, @Argument String lastName, @Argument String showName) {
        return graphQLMutationService.signUp(firstName, lastName, showName);
    }

    @MutationMapping
    public Boolean forgotPassword(@Argument String email) {
        return graphQLMutationService.forgotPassword(email);
    }

    @MutationMapping
    public Boolean verifyEmail(@Argument String showToken) {
        return graphQLMutationService.verifyEmail(showToken);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean resetPassword() {
        return this.graphQLMutationService.resetPassword();
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updatePassword() {
        return this.graphQLMutationService.updatePassword();
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updateUserProfile(@Argument UserProfile userProfile) {
        return this.graphQLMutationService.updateUserProfile(userProfile);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean requestApiAccess() {
        return this.graphQLMutationService.requestApiAccess();
    }

    @MutationMapping
    @RequiresAccess
    public Boolean deleteAccount() {
        return this.graphQLMutationService.deleteAccount();
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updateShow(@Argument String email, @Argument String showName) {
        return this.graphQLMutationService.updateShow(email, showName);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updatePreferences(@Argument Preference preferences) {
        return this.graphQLMutationService.updatePreferences(preferences);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updatePages(@Argument List<Page> pages) {
        return this.graphQLMutationService.updatePages(pages);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updatePsaSequences(@Argument List<PsaSequence> psaSequences) {
        return this.graphQLMutationService.updatePsaSequences(psaSequences);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updateSequences(@Argument List<Sequence> sequences) {
        return this.graphQLMutationService.updateSequences(sequences);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean updateSequenceGroups(@Argument List<SequenceGroup> sequenceGroups) {
        return this.graphQLMutationService.updateSequenceGroups(sequenceGroups);
    }

    @MutationMapping
    @RequiresAccess
    public Boolean playSequenceFromControlPanel(@Argument Sequence sequence) {
        return this.graphQLMutationService.playSequenceFromControlPanel(sequence);
    }


    /*******
     Queries
     *******/
    @QueryMapping
    public Show signIn() {
        return graphQLQueryService.signIn();
    }

    @QueryMapping
    public Show verifyPasswordResetLink(@Argument String passwordResetLink) {
        return graphQLQueryService.verifyPasswordResetLink(passwordResetLink);
    }

    @QueryMapping
    @RequiresAccess()
    public Show getShow() {
        return graphQLQueryService.getShow();
    }

    @QueryMapping
    @RequiresAccess()
    public DashboardStatsResponse dashboardStats(@Argument Long startDate, @Argument Long endDate, @Argument String timezone) {
        return dashboardService.dashboardStats(startDate, endDate, timezone, true);
    }

    @QueryMapping
    @RequiresAccess()
    public DashboardLiveStatsResponse dashboardLiveStats(@Argument Long startDate, @Argument Long endDate, @Argument String timezone) {
        return dashboardService.dashboardLiveStats(startDate, endDate, timezone);
    }
}
