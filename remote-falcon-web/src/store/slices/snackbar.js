import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: 'snackbar',
  action: false,
  open: false,
  message: 'Note archived',
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center'
  },
  variant: 'alert',
  alert: {
    color: 'primary',
    variant: 'filled'
  },
  transition: 'Fade',
  close: true,
  actionButton: false
};

const snackbar = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar(state, action) {
      const { open, message, anchorOrigin, variant, alert, transition, actionButton, id } = action.payload;

      state.id = id || initialState.id;
      state.action = !state.action;
      state.open = open || initialState.open;
      state.message = message || initialState.message;
      state.anchorOrigin = anchorOrigin || initialState.anchorOrigin;
      state.variant = variant || initialState.variant;
      state.alert = {
        color: alert?.color || initialState.alert.color,
        variant: alert?.variant || initialState.alert.variant
      };
      state.transition = transition || initialState.transition;
      state.close = initialState.close;
      state.actionButton = actionButton || initialState.actionButton;
    },

    closeSnackbar(state) {
      state.open = false;
    }
  }
});

export default snackbar.reducer;

export const { closeSnackbar, openSnackbar } = snackbar.actions;
