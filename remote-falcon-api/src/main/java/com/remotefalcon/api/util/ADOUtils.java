package com.remotefalcon.api.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.model.Comments;
import com.remotefalcon.api.model.WorkItemCommentDetails;
import com.remotefalcon.api.model.WorkItemComments;
import com.remotefalcon.api.request.ADOWorkItemRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.azd.enums.CustomHeader;
import org.azd.enums.QueryExpand;
import org.azd.enums.RequestMethod;
import org.azd.exceptions.AzDException;
import org.azd.helpers.JsonMapper;
import org.azd.utils.AzDClientApi;
import org.azd.utils.RestClient;
import org.azd.workitemtracking.WorkItemTrackingApi;
import org.azd.workitemtracking.types.WorkItem;
import org.azd.workitemtracking.types.WorkItemList;
import org.azd.workitemtracking.types.WorkItemQueryResult;
import org.azd.workitemtracking.types.WorkItemReference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Component
@Slf4j
public class ADOUtils {

  @Value("${ADO_PAT}")
  String adoPat;

  public WorkItemTrackingApi workItemTrackingApi() {
    AzDClientApi azDClientApi = this.getAdoConnection();
    return azDClientApi.getWorkItemTrackingApi();
  }

  private AzDClientApi getAdoConnection() {
    String organizationName = "remotefalcon";
    String projectName = "Remote%20Falcon";
    return new AzDClientApi(organizationName, projectName, adoPat);
  }

  public WorkItemList queryWorkItems(String queryId) {
    try {
      WorkItemTrackingApi workItemTrackingApi = this.workItemTrackingApi();
      String wiql = workItemTrackingApi.getQuery(queryId, 0, QueryExpand.WIQL, false, false).getWiql();
      WorkItemQueryResult workItemQueryResult = workItemTrackingApi.queryByWiql("Remote Falcon Team", wiql);
      int[] workItemIds = workItemQueryResult.getWorkItems().stream().mapToInt(WorkItemReference::getId).toArray();
      return workItemTrackingApi.getWorkItems(workItemIds);
    }catch (AzDException e) {
      log.error("Error in query work items with query ID {}", queryId);
      return null;
    }
  }

  public WorkItem workItemDetails(Integer workItemId) {
    try {
      WorkItemTrackingApi workItemTrackingApi = this.workItemTrackingApi();
      return workItemTrackingApi.getWorkItem(workItemId);
    }catch (AzDException e) {
      log.error("Error in getting work item details with work item ID {}", workItemId);
      return null;
    }
  }

  public List<Comments> workItemComments(String workItemCommentsUrl) {
    try {
      AzDClientApi azDClientApi = this.getAdoConnection();
      String response = RestClient.send(workItemCommentsUrl, azDClientApi.getConnection(), RequestMethod.GET, null, CustomHeader.JSON, false);
      List<Comments> comments = new ArrayList<>();
      if(response != null) {
        JsonMapper jsonMapper = new JsonMapper();
        jsonMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        WorkItemComments workItemComments = jsonMapper.mapJsonResponse(response, WorkItemComments.class);

        if(CollectionUtils.isNotEmpty(workItemComments.getComments())) {
          workItemComments.getComments().forEach(workItemComment -> {
            Comments comment = new Comments();
            comment.setCreatedDate(ZonedDateTime.parse(workItemComment.getCreatedDate()));
            String[] textSplit = workItemComment.getText().split(":");
            if(textSplit.length <= 1) {
              comment.setText(textSplit[0]);
            }else {
              comment.setCreatedBy(textSplit[0]);
              StringBuilder commentText = new StringBuilder();
              for(int i = 1; i < textSplit.length; i++) {
                commentText.append(textSplit[i]);
                commentText.append(":");
              }
              commentText.deleteCharAt(commentText.length() - 1);
              comment.setText(StringEscapeUtils.escapeJava(commentText.toString()));
            }
            comments.add(comment);
          });
        }
      }
      return comments;
    }catch (AzDException e) {
      log.error("Error getting work item comments {}", workItemCommentsUrl);
      return null;
    }
  }

  public void addWorkItemComment(String workItemCommentsUrl, WorkItemCommentDetails workItemCommentDetails) {
    try {
      AzDClientApi azDClientApi = this.getAdoConnection();
      RestClient.send(workItemCommentsUrl + "?api-version=7.1-preview", azDClientApi.getConnection(), RequestMethod.POST, workItemCommentDetails, CustomHeader.JSON_CONTENT_TYPE, false);
    }catch (AzDException e) {
      log.error("Error saving work item comment {}", workItemCommentsUrl);
    }
  }

  public void editWorkItem(Integer workItemId, ADOWorkItemRequest adoWorkItemRequest) {
    try {
      WorkItemTrackingApi workItemTrackingApi = this.workItemTrackingApi();
      var fieldsToUpdate = new HashMap<String, Object>();
      fieldsToUpdate.put("System.Title", adoWorkItemRequest.getTitle());
      fieldsToUpdate.put("System.Description", adoWorkItemRequest.getDescription());
      fieldsToUpdate.put("System.State", adoWorkItemRequest.getState());
      if(StringUtils.equalsIgnoreCase("Bug", adoWorkItemRequest.getType())) {
        fieldsToUpdate.put("Microsoft.VSTS.Common.Severity", adoWorkItemRequest.getSeverity());
      }
      workItemTrackingApi.updateWorkItem(workItemId, fieldsToUpdate);
    }catch (AzDException e) {
      log.error("Error editing work item {}", workItemId);
    }
  }

  public void createWorkItem(ADOWorkItemRequest adoWorkItemRequest, Remote remote) {
    try {
      WorkItemTrackingApi workItemTrackingApi = this.workItemTrackingApi();
      var additionalFields = new HashMap<String, Object>() {{
        put("System.Tags", "Visible in RF");
        put("Custom.RequestedBy", remote.getRemoteName());
      }};
      if(StringUtils.equalsIgnoreCase("Bug", adoWorkItemRequest.getType())) {
        additionalFields.put("Microsoft.VSTS.Common.Severity", adoWorkItemRequest.getSeverity());
      }
      workItemTrackingApi.createWorkItem(adoWorkItemRequest.getType(), adoWorkItemRequest.getTitle(), adoWorkItemRequest.getDescription(), additionalFields);
    }catch (AzDException e) {
      log.error("Error creating work item");
    }
  }

  public void deleteWorkItem(Integer workItemId) {
    try {
      WorkItemTrackingApi workItemTrackingApi = this.workItemTrackingApi();
      workItemTrackingApi.deleteWorkItem(workItemId);
    }catch (AzDException e) {
      log.error("Error deleting work item {}", workItemId);
    }
  }
}
