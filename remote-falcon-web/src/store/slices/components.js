import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 0
};

const components = createSlice({
  name: 'components',
  initialState,
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    }
  }
});

export default components.reducer;

export const { setActiveTab } = components.actions;
