export const addSequenceToQueueService = (addSequenceToQueueMutation, name, viewerLatitude, viewerLongitude, callback) => {
  addSequenceToQueueMutation({
    variables: {
      name,
      latitude: parseFloat(viewerLatitude),
      longitude: parseFloat(viewerLongitude)
    },
    onCompleted: (response) => {
      callback({
        success: true,
        response
      });
    },
    onError: (error) => {
      callback({
        success: false,
        error
      });
    }
  });
};

export const voteForSequenceService = (voteForSequenceMutation, name, viewerLatitude, viewerLongitude, callback) => {
  voteForSequenceMutation({
    variables: {
      name,
      latitude: parseFloat(viewerLatitude),
      longitude: parseFloat(viewerLongitude)
    },
    onCompleted: (response) => {
      callback({
        success: true,
        response
      });
    },
    onError: (error) => {
      callback({
        success: false,
        error
      });
    }
  });
};
