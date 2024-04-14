import { StatusResponse } from '../utils/enum';
import { GET_SHOW } from '../utils/graphql/queries';
import { showAlertOld } from '../views/pages/globalPageHelpers';

export const deleteAccountService = (deleteAccountMutation, callback) => {
  deleteAccountMutation({
    onCompleted: () => {
      callback({
        success: true
      });
    },
    onError: () => {
      callback({
        success: false,
        toast: { alert: 'error' }
      });
    }
  });
};

export const requestApiAccessService = (requestApiAccessMutation, callback) => {
  requestApiAccessMutation({
    onCompleted: () => {
      callback({
        success: true,
        toast: { message: 'API Access Requested' }
      });
    },
    onError: (error) => {
      if (error?.message === StatusResponse.API_ACCESS_REQUESTED) {
        callback({
          success: false,
          toast: { alert: 'error' }
        });
      } else {
        callback({
          success: false,
          toast: { alert: 'warning', message: 'API Access Already Requested' }
        });
      }
    },
    refetchQueries: [{ query: GET_SHOW, awaitRefetchQueries: true }]
  });
};

export const savePagesService = (updatedPages, updatePagesMutation, callback) => {
  const variables = {
    pages: updatedPages
  };
  updatePagesMutation({
    variables,
    onCompleted: () => {
      callback({
        success: true,
        toast: { message: 'Viewer Pages Saved' }
      });
    },
    onError: () => {
      callback({
        success: false,
        toast: { alert: 'error' }
      });
    },
    refetchQueries: [{ query: GET_SHOW, awaitRefetchQueries: true }]
  });
};

export const savePreferencesService = (updatedPreferences, updatePreferencesMutation, callback) => {
  updatePreferencesMutation({
    variables: {
      preferences: {
        ...updatedPreferences
      }
    },
    onCompleted: () => {
      callback({
        success: true,
        toast: { message: 'Viewer Settings Saved' }
      });
    },
    onError: () => {
      callback({
        success: false,
        toast: { alert: 'error' }
      });
    },
    refetchQueries: [{ query: GET_SHOW, awaitRefetchQueries: true }]
  });
};

export const savePsaSequencesService = (updatedPsaSequences, updatePsaSequencesMutation, callback) => {
  updatePsaSequencesMutation({
    variables: {
      psaSequences: updatedPsaSequences
    },
    onCompleted: () => {
      callback({
        success: true,
        toast: { message: 'Viewer Settings Saved' }
      });
    },
    onError: () => {
      callback({
        success: false,
        toast: { alert: 'error' }
      });
    },
    refetchQueries: [{ query: GET_SHOW, awaitRefetchQueries: true }]
  });
};

export const saveShowService = (updatedShow, updateShowMutation, callback) => {
  updateShowMutation({
    variables: {
      email: updatedShow?.email,
      showName: updatedShow?.showName
    },
    onCompleted: () => {
      callback({
        success: true,
        toast: { message: 'User Profile Saved' }
      });
    },
    onError: () => {
      callback({
        success: false,
        toast: { alert: 'error' }
      });
    },
    refetchQueries: [{ query: GET_SHOW, awaitRefetchQueries: true }]
  });
};

export const saveUserProfileService = (updatedUserProfile, updateUserProfileMutation, callback) => {
  updateUserProfileMutation({
    variables: {
      userProfile: {
        firstName: updatedUserProfile?.firstName,
        lastName: updatedUserProfile?.lastName,
        facebookUrl: updatedUserProfile?.facebookUrl,
        youtubeUrl: updatedUserProfile?.youtubeUrl
      }
    },
    onCompleted: () => {
      callback({
        success: true,
        toast: { message: 'User Profile Saved' }
      });
    },
    onError: () => {
      callback({
        success: false,
        toast: { alert: 'error' }
      });
    },
    refetchQueries: [{ query: GET_SHOW, awaitRefetchQueries: true }]
  });
};

export const updatePasswordService = (currentPassword, newPassword, updatePasswordMutation, callback) => {
  const currentPasswordBase64 = Buffer.from(currentPassword, 'binary').toString('base64');
  const newPasswordBase64 = Buffer.from(newPassword, 'binary').toString('base64');
  updatePasswordMutation({
    context: {
      headers: {
        NewPassword: newPasswordBase64,
        Password: currentPasswordBase64
      }
    },
    onCompleted: () => {
      callback({
        success: true
      });
    },
    onError: () => {
      callback({
        success: false,
        toast: { alert: 'error', message: 'Failed to Update Password' }
      });
    }
  });
};
