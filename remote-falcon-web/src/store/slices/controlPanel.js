import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  remotePrefs: {},
  sequences: {},
  remoteViewerPages: {},
  remoteViewerPageTemplates: {},
  externalViewerPageMeta: {}
};

const controlPanel = createSlice({
  name: 'controlPanel',
  initialState,
  reducers: {
    setRemotePrefs(state, action) {
      state.remotePrefs = action.payload;
    },
    setSequences(state, action) {
      state.sequences = action.payload;
    },
    setRemoteViewerPages(state, action) {
      state.remoteViewerPages = action.payload;
    },
    setRemoteViewerPageTemplates(state, action) {
      state.remoteViewerPageTemplates = action.payload;
    },
    setExternalViewerPageMeta(state, action) {
      state.externalViewerPageMeta = action.payload;
    }
  }
});

export default controlPanel.reducer;

export const { setRemotePrefs, setSequences, setRemoteViewerPages, setRemoteViewerPageTemplates, setExternalViewerPageMeta } =
  controlPanel.actions;
