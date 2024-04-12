import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  isDemo: false,
  show: null
};

const show = createSlice({
  name: 'show',
  initialState,
  reducers: {
    startLoginAction(state, action) {
      state.isLoggedIn = true;
      state.isInitialized = true;
      state.show = action?.payload;
    },
    startLogoutAction(state) {
      state.isLoggedIn = false;
      state.isInitialized = true;
      state.show = null;
    },
    startFetchShowAction(state, action) {
      state.show = action?.payload?.show;
    },
    setShow(state, action) {
      state.show = action?.payload;
    }
  }
});

export default show.reducer;

export const { startLoginAction, startLogoutAction, startFetchShowAction, setShow } = show.actions;
