import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedItem: ['dashboard'],
  drawerOpen: false
};

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.selectedItem = action.payload;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload;
    }
  }
});

export default menu.reducer;

export const { activeItem, openDrawer } = menu.actions;
